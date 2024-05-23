'use client'

import Image from 'next/image';

import React, { useState, useEffect, useRef } from 'react';

import { ref, set, onValue, query, orderByKey, limitToLast } from "firebase/database";
import { database } from './firebaseConfig';

import axios from 'axios';

import notOkImage from './notok.jpg';
import { limit } from 'firebase/firestore';

interface Log {
  id: string;
  date: string;
  time: string;
  status: string;
}

function formatDateAndTime() {
  // Create a Date object for the current date and time
  const date = new Date();

  // Set options for formatting the date and time
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Bangkok"
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Bangkok"
  };

  // Format the date and time
  const formattedDate = date.toLocaleDateString('en-GB', dateOptions);
  const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);

  // Return formatted date and time
  return {
    date: formattedDate,
    time: formattedTime
  };
}

function App() {
  const [currentState, setCurrentState] = useState(0);
  const [tables, setTables] = useState<Log[]>([]);

  useEffect(() => {
    const tableRef = ref(database, 'logs');
    const sortedByDateQuery = query(tableRef, orderByKey(), limitToLast(10));
    
    onValue(sortedByDateQuery, (snapshot) => {
      const tableData = snapshot.val();
      if (tableData) {
        const tableList = Object.keys(tableData).reverse().map((key) => ({
          id: key,
          ...tableData[key]
        }));
        setTables(tableList);
      }
    });
  }, []);

  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const lastWriteTimeRef = useRef(0);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      let url = "https://api.netpie.io/v2/device/shadow/data";
      try {
        const response = await axios.get(url, {
          auth: {
            username: 'a80f1ca2-1d2b-4cd1-9fce-e930b7a59ef8',
            password: 'Hbxd2iAMGYpeCPXSbFQwUruaptgHDFNe'
          }
        });

        if (!isMounted) return;

        setData(response.data.data);

        setCurrentState(prevState => {
          if (prevState !== null && prevState % 2 === 0 && response.data.data.val % 2 === 1) {
            const now = Date.now();
            if (now - lastWriteTimeRef.current > 1000) { // 1 second debounce
              const dateAndTime = formatDateAndTime();
              writeUserData(dateAndTime.date, dateAndTime.time, "red");
              lastWriteTimeRef.current = now;
            }
          }

          return response.data.data.val % 2;
        });

        setError('');
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
      }
    };

    fetchData(); // Fetch initial data

    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const writeUserData = (date: string, time: string, status: string) => {
    let userId = Date.now();
    set(ref(database, 'logs/' + userId), {
      date: date,
      time: time,
      status: status,
    }).then(() => {
      console.log("Data saved successfully!");
    }).catch((error) => {
      console.log("Data could not be saved." + error);
    });
  };

  return (
    <div className="App">
      <div className="curstate">
      <div className = "text-chadchart text-2xl py-2">มีรถจอด</div>
      <div id="container">
        <div id="redgreen"></div>
        <Image 
          src = {notOkImage}
          height="296"
          alt=""
          id="meme"
        />
      </div>
      
      <div className = "text-chadchart text-2xl py-2">Detected History</div>
      <table id = "myTable" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          
        <tbody>
        {tables.map((log) => (
          <tr key={log.id}>
            <td>{log.date}</td>
            <td>{log.time}</td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>
      <div className = "h-10"></div>
    </div>
  );
}

export default App;

/*
      <h1>logs</h1>
      {error && <p>{error}</p>}
      <ul>
        {data.val}
      </ul>
      <h1>{currentState % 2}</h1>
      <ul>
        {data.val % 2}
      </ul>
      <div className = 
*/