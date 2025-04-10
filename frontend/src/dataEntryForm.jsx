

import { FormLabel, Paper } from '@mui/material';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Navigate, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';

function EnterData({isTracking}) {
  const backend_Url = import.meta.env.VITE_BACKEND_URL;
  const [dbName,setdbName] = useState("");
  const handleChange = (evt)=>{
     setdbName(()=> evt.target.value)
  }
  const [connectionString,setConnectionString] = useState("");
  const handleChangeName = (evt)=>{
     setConnectionString(()=> evt.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      dbName:dbName,
      connectionString:connectionString
    }
    try {
      const response = await fetch(`${backend_Url}/api/v1/db/registerDB`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
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
        isTracking();
      } else {
        alert('Failed to register database');
      }
    } catch (error) {
      console.error(error);
      
    } 

  }
  return (
    <Container style={{display:'flex',justifyContent:'center',alignItems:'center',height:'90vh'}}>
        <Paper elevation={6}>
        <Card style={{ width: '18rem'}}>
        <Card.Body>
            <Card.Title style={{display:'flex',justifyContent:'center'}}>Add Database Info</Card.Title>
            <br />
            <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
            <Container style={{display:'flex',justifyContent:'left'}}>
            <Form>
                <Card.Text style={{display:'flex',justifyContent:'left'}}>
                Enter your Database Name <br/>
                </Card.Text>
              <Form.Control type='text' name='dbName' placeholder='Database' onChange={handleChange} value={dbName}></Form.Control>
                <br />
                <Card.Text style={{display:'flex',justifyContent:'left'}}>
                Enter Connection String
                </Card.Text>
                <Form.Control type='text' name='connectionString' placeholder='Connection String' onChange={handleChangeName} value={connectionString}></Form.Control>
                <br />
                <Button style={{marginTop:10,justifyContent:'left'}} variant='primary'type='submit' onClick={handleSubmit} >Submit</Button>
            </Form>
            </Container>
        </Card.Body>
        </Card>
        </Paper>
    </Container>
  );
}

export default EnterData;