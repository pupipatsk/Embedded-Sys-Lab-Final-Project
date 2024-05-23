'use client'

import Image from 'next/image';

import React, { useState, useEffect, useRef } from 'react';

import { ref, set, onValue, query, orderByKey, limitToLast } from "firebase/database";
import { database } from './firebaseConfig';

import axios from 'axios';

import notOkImage from './notok.jpg';
import okImage from './ok.jpg';
import arai from './arai.png'
import notOk from './carNOTOK.jpg'
import ok from './carOK.jpg'
import github from './githubIcon.png'
import { limit } from 'firebase/firestore';
import { tree } from 'next/dist/build/templates/app-page';

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

    const intervalId = setInterval(fetchData, 3600000); // Fetch data every 1 hours

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

  const [parking , setParking] = useState(false);

  return (
    <div className="App">
      <nav>
        <div>
        <Image 
          src = {arai}
          height="70"
          alt=""
          className='ml-3'
        />
        </div>
        <div className="col-md-4 col-sm-5 col-xs-12 pr-5">
            <ul>
              <li><a href="https://github.com/pupipatsk/Embedded-Sys-Lab-Final-Project" className="github">
              <Image 
                src = {github}
                height="50"
                alt=""
                className='ml-3'
              />
              </a></li>
            </ul>
          </div>
      </nav>
      <div className="curstate">
      <div className = {parking ? "text-chadchart text-2xl py-2 text-red-500":"text-chadchart text-2xl py-2"}> {parking ? "มีรถจอด":"ไม่มีรถจอด"}</div>
      <div id="container">
        <div>
          <Image 
            src = {parking ? notOk:ok}
            height="296"
            alt=""
            id="meme"
          />
        </div>
        <Image 
          src = {parking ? notOkImage:okImage}
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
    <footer className="site-footer">
      <div className="container1">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <h6>About</h6>
            <p className="text-justify">คำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบายคำอธิบาย</p>
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>จัดทำโดย</h6>
            <ul className="footer-links">
              <li>1.หก่ดสาหกด</li>
              <li>2.หกดหกดกหด</li>
              <li>3.หกดหกดหกด</li>
              <li>4.หกดหกดหกด</li>
            </ul>
          </div>

 
        </div>
      </div>
      <div className="container">
        <div className="row">
          {/* <div className="col-md-8 col-sm-6 col-xs-12">
            <p className="copyright-text">Copyright &copy; 2017 All Rights Reserved by 
         <a href="#">Scanfcode</a>.
            </p>
          </div> */}

          {/* <div className="col-md-4 col-sm-5 col-xs-12 p-50 mr-20">
            <ul className="social-icons">
              <li><a className="facebook" href="#"><i className="fa fa-facebook"></i></a></li>
              <li><a className="twitter" href="#"><i className="fa fa-twitter"></i></a></li>
              <li><a className="dribbble" href="#"><i className="fa fa-dribbble"></i></a></li>
              <li><a className="linkedin" href="#"><i className="fa fa-linkedin"></i></a></li>   
            </ul>
          </div> */}
        </div>
      </div>
</footer>
    </div>



  );
}

export default App;