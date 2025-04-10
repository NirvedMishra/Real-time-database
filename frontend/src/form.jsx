import { FormLabel, Paper } from '@mui/material';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Navigate, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';

function LoginCard() {
  const navigate = useNavigate()
  const [emailId,setEmailId] = useState("");
  const handleChange = (evt)=>{
     setEmailId(()=> evt.target.value)
  }
  const [password,setPassword] = useState("");
  const handleChangePass = (evt)=>{
     setPassword(()=> evt.target.value)
  }
  const handleSubmit = (e) => {
     e.preventDefault();
    navigate(`/dashboard`);
  }
  return (
    <Container style={{display:'flex',justifyContent:'center',alignItems:'center',height:'80vh'}}>
        <Paper elevation={6}>
        <Card style={{ width: '18rem'}}>
        <Card.Body>
            <Card.Title>Login</Card.Title>
            <br />
            <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
            <Card.Text>
            Enter your Email ID <br/>
            </Card.Text>
            <Container style={{display:'flex',justifyContent:'left'}}>
            <Form>
              <Form.Control type='text' name='email' placeholder='Email ID' onChange={handleChangePass} value={password}></Form.Control>
            </Form>
            </Container>
            <br />
            <Card.Text>
            Enter your Password
            </Card.Text>
            <Container style={{display:'flex',justifyContent:'left'}}>
            <Form>
              <Form.Control type='password' name='password' placeholder='Password' onChange={handleChange} value={emailId}></Form.Control>
              <Button style={{marginTop:10}} variant='primary'type='submit' onClick={handleSubmit}>Submit</Button>
            </Form>
            </Container>
        </Card.Body>
        </Card>
        </Paper>
    </Container>
  );
}

export default LoginCard;