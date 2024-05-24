'use client'

import Image from 'next/image';
import { Inter } from 'next/font/google'

import React, { useState, useEffect, useRef } from 'react';

import { ref, set, onValue, query, orderByKey, limitToLast, get, update } from "firebase/database";
import { database } from './firebaseConfig';

import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"

import axios from 'axios';

import notOkImage from './notok.jpg';
import okImage from './ok.jpg';
import arai from './arai.png'
import notOk from './carNOTOK.jpg'
import ok from './carOK.jpg'
import github from './githubIcon.png'

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

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

function App() {

  const [currentState, setCurrentState] = useState(0);
  const [tables, setTables] = useState<Log[]>([]);
  const [startParkingTime, setStartParkingTime] = useState(null);
  const [parkedTime, setParkedTime] = useState("");

  const [latestLog, setLatestLog] = useState("");
  const [toggleParked, setToggleParked] = useState(0);

  // Function to update the mins of the latest log
  const updateLatestLogMins = async () => {
    //console.log(latestLog);
    if (latestLog) {
      const logRef = ref(database, `logs/${latestLog}`);
      try {
        await update(logRef, { status : parkedTime });
        console.log('Log mins updated successfully');
        // Optionally, you can fetch the latest log again to update the state
        // fetchLatestLog();
      } catch (error) {
        console.error('Error updating log mins:', error);
      }
    } else {
      console.log('No log to update');
    }
  };

  useEffect(() => {
    if (currentState === 0 && startParkingTime !== null) {
      const now = new Date();
      const elapsed = now - startParkingTime;
      const hours = Math.round(elapsed / 3600000);
      const minutes = Math.round((elapsed % 3600000) / 60000);
      const seconds = Math.round((elapsed % 60000) / 1000);
      setParkedTime(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
      setToggleParked(1 - toggleParked);

      console.log("Changed Parked");

      //fetchLatestLog();
     //updateLatestLogMins();

      setStartParkingTime(null); // Reset the start time
    } else if (currentState === 1) {
      const dateAndTime = formatDateAndTime();
      //writeUserData(dateAndTime.date, dateAndTime.time, "Still Parking");
      setStartParkingTime(new Date());
    }
  }, [currentState]);

  useEffect(() => {
    updateLatestLogMins();
  }, [toggleParked]);

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
              writeUserData(dateAndTime.date, dateAndTime.time, "Still Parking");
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

    const intervalId = setInterval(fetchData, 1000); // Fetch data every 1 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const writeUserData = async (date: string, time: string, status: string) => {
    let userId = Date.now();
    setLatestLog(userId.toString());
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
      <nav>
        <div>
          <Image
            src={arai}
            height="70"
            alt=""
            className='ml-3'
          />
        </div>
        <div className="col-md-4 col-sm-5 col-xs-12 pr-5">
          <ul>
            <li><a href="https://github.com/pupipatsk/Embedded-Sys-Lab-Final-Project" className="github">
              <Image
                src={github}
                height="50"
                alt=""
                className='ml-3'
              />
            </a></li>
          </ul>
        </div>
      </nav>
      <div className="curstate">
        <div className={currentState ? "text-chadchart text-2xl py-2 text-red-500 text-center" : "text-chadchart text-2xl py-2 text-center"}> {currentState ? "มีรถจอด" : "ไม่มีรถจอด"}</div>
        <div id="container">
            <Image
              src={currentState ? notOk : ok}
              height="296"
              alt=""
              id="meme"
            />
          <Image
            src={currentState ? notOkImage : okImage}
            height="296"
            alt=""
            id="meme"
          />
        </div>
        <div className="text-chadchart text-2xl py-2 text-center">Detected History</div>
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] text-center">Date</TableHead>
                <TableHead className="w-[150px] text-center">Time</TableHead>
                <TableHead className="w-[150px] text-center">Elapsed Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((log) => (
                <TableRow key = {log.id}>
                  <TableCell className = "text-center">{log.date}</TableCell>
                  <TableCell className = "text-center">{log.time}</TableCell>
                  <TableCell className = "text-center">{log.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        {/*<table id="myTable" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <tbody>
            {tables.map((log) => (
              <tr key={log.id}>
                <td>{log.date}</td>
                <td>{log.time}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>*/}
      </div>

      <div className="h-10"></div>
      <footer className="site-footer">
        <div className="container1">
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <h6>About</h6>
              <p className="text-justify">การตรวจจับการฝ่าฝืนจอดรถในที่ห้ามจอด เพื่อแก้ปัญหาการจราจรติดที่เกิดจากการจอดในที่ห้ามจอด โดยใช้ sensor วัดแสงและระยะทาง และจะมีการส่งสัญญาณเตือนผ่านลำโพงและแสดงสถานะ/ประวัติขึ้นweb</p>
            </div>

            <div className="col-xs-6 col-md-3">
              <h6>จัดทำโดย</h6>
              <ul className="footer-links">
                <li>1. นาย ชญานิน คงเสรีกุล 6532035021</li>
                <li>2. นาย ชนาธิป พัฒนเพ็ญ 6532040021</li>
                <li>3. นาย ธีภพ เล้าพรพิชยานุวัฒน์ 6532100021</li>
                <li>4. นาย ภูภิพัทธ์ สิงขร 6532142421</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;