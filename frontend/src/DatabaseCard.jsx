import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/esm/Button';
import { Navigate,useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from './Auth/AuthProvider';

function DataTable() {
  //const navigate= useNavigate();
  const backend_Url = import.meta.env.VITE_BACKEND_URL;
  const Auth = useAuth();
  const userId = JSON.parse(Auth.info)._id;
  const dbName = JSON.parse(Auth.info).dbName;

  const [data, setData] = useState([]);
  
  useEffect(() => {
     const getData = async()=>{
      try {
        const response = await fetch(`${backend_Url}/api/v1/db/giveDB`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong');
          } else {
            throw new Error('Unexpected response format');
          }
        }
        const res = await response.json();
        if (res.statusCode == 200) {
          setData(res.data);
        }   
  } catch (error) {
    console.error(error);
  }
     }
     getData();
    const socket = io(backend_Url, {
      query: { userId },
      transports: ['websocket'], // optional: skip polling
    });

    // 2) Subscribe to the user‑specific event
    const eventName = `realtime-update-${userId}`;
    socket.on(eventName, (data) => {
      setData((prevData) => {
        const newData = [...prevData,data];
        return newData;
      })
    });

    // 3) Cleanup on unmount: disconnect socket and remove listeners
    return () => {
      socket.off(eventName);
      socket.disconnect();
    };
  }, []);
 
  function formatIso(isoString) {
    const dt = new Date(isoString);
  
    // DD/MM/YYYY
    const date = dt.toLocaleDateString('en-GB'); 
    // e.g. "10/04/2025"
  
    // HH:MM:SS (24‑hour clock)
    const time = dt.toLocaleTimeString('en-GB', {
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    // e.g. "20:08:26"
  
    return { date, time };
  }
  return (
    <Container>
      <h2 className="mt-4">Database: {dbName}</h2>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Time</th>
            <th>Collection Name</th>
            <th>Operation Type</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.slice().reverse().map((item,i) => (
              <tr key={i}>
                <td>{`${formatIso(item.time).time}, ${formatIso(item.time).date}`}</td>
                <td>{item.collectionName}</td>
                <td>{item.operationType}</td>
                <td>{item.documentId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                Loading data...
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {/* <div className="d-flex justify-content-center my-3">
        <Button variant="primary" onClick={handleSubmit}>
          Add Entry
        </Button>
      </div> */}
    </Container>
  );
}

export default DataTable;
