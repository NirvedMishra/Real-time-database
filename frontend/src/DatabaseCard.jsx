import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/esm/Button';
import { Navigate,useNavigate } from 'react-router-dom';

function DataTable() {
  //const navigate= useNavigate();
  const [data, setData] = useState([]);
  useEffect(() => {
    const names = ["Shrey Jaiswal", "Aryan Poonia", "Nirved Mishra"];
    const operations = ["Added", "Edited", "Edited"];
    const time= ["23:40:00","14:25:56","15:58:23"];
  
    const testData = [...Array(3)].map((_, i) => ({
      id: i + 1,
      name: `${names[i]}`,
      operation: `${operations[i]}`,
      time: `${time[i]}`
    }));
  
    setData(testData);
  }, []);
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //  navigate(`/addentry`);
  // }
  
//   useEffect(() => {
//     // Replace this URL with your backend API endpoint
//     fetch('https://example.com/api/data')
//       .then((response) => response.json())
//       .then((fetchedData) => {
//         setData(fetchedData);
//       })
//       .catch((error) => console.error('Error fetching data:', error));
//   }, []);

  return (
    <Container>
      <h2 className="mt-4">Details</h2>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Time</th>
            <th>Name</th>
            <th>Operation Type</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.time}</td>
                <td>{item.name}</td>
                <td>{item.operation}</td>
                <td>{item.id}</td>
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
