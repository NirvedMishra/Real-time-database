// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';

// function EnterData() {
//   return (
//     <Form>
//       <Form.Group className="mb-3" controlId="formBasicEmail">
//         <Form.Label>Email address</Form.Label>
//         <Form.Control type="email" placeholder="Enter email" />
//         <Form.Text className="text-muted">
//           We'll never share your email with anyone else.
//         </Form.Text>
//       </Form.Group>

//       <Form.Group className="mb-3" controlId="formBasicPassword">
//         <Form.Label>Password</Form.Label>
//         <Form.Control type="password" placeholder="Password" />
//       </Form.Group>
//       <Form.Group className="mb-3" controlId="formBasicCheckbox">
//         <Form.Check type="checkbox" label="Check me out" />
//       </Form.Group>
//       <Button variant="primary" type="submit">
//         Submit
//       </Button>
//     </Form>
//   );
// }

// export default EnterData;

import { FormLabel, Paper } from '@mui/material';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Navigate, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';

function EnterData() {
  const navigate = useNavigate()
  const [ID,setID] = useState("");
  const handleChange = (evt)=>{
     setID(()=> evt.target.value)
  }
  const [name,setName] = useState("");
  const handleChangeName = (evt)=>{
     setName(()=> evt.target.value)
  }
  const [dept,setDept] = useState("");
  const handleChangeDept = (evt)=>{
     setDept(()=> evt.target.value)
  }
  const handleSubmit = (e) => {
     e.preventDefault();
    navigate(`/dashboard`)
  }
  return (
    <Container style={{display:'flex',justifyContent:'center',alignItems:'center',height:'90vh'}}>
        <Paper elevation={6}>
        <Card style={{ width: '18rem'}}>
        <Card.Body>
            <Card.Title style={{display:'flex',justifyContent:'center'}}>Add Details</Card.Title>
            <br />
            <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
            <Container style={{display:'flex',justifyContent:'left'}}>
            <Form>
                <Card.Text style={{display:'flex',justifyContent:'left'}}>
                Enter your Roll Number <br/>
                </Card.Text>
              <Form.Control type='number' name='rollno' placeholder='Roll Number' onChange={handleChange} value={ID}></Form.Control>
                <br />
                <Card.Text style={{display:'flex',justifyContent:'left'}}>
                Enter your Name
                </Card.Text>
                <Form.Control type='text' name='Name' placeholder='Name' onChange={handleChangeName} value={name}></Form.Control>
                <br />
                <Card.Text style={{display:'flex',justifyContent:'left'}}>
                Enter your Department
                </Card.Text>
                <Form.Control type='text' name='Department' placeholder='Department' onChange={handleChangeDept} value={dept}></Form.Control>
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