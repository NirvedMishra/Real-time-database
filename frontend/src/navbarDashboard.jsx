import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from './Auth/AuthProvider';

function NavbarDashboard() {
  const Auth = useAuth();
  const handleLogout = async () => { 
    await Auth.logOut();
  }
  return (
    <Navbar className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">DeltaWatch</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {/* <Navbar.Text>
            Signed in as: <a href="#login">Shrey</a>
          </Navbar.Text> */}
          <Navbar.Text>
            <button onClick={handleLogout}>Logout</button>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarDashboard;