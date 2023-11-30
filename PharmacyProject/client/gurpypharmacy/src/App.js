
//importing styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
//importing custom components
import PatientRegistration from './pages/registrationPage';
import UserLogin from './pages/loginPage';
//importing bootstrap components
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PharmacistView from './pages/pharmacistView';

function App() {
  return (
    <Router>
      <Navbar className="navbar">
      <Navbar.Brand href="#home">Gurpy's Pharmacy</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/login">Log-In</Nav.Link>
            <Nav.Link href="/register">Patient's Sign up with us</Nav.Link>
            <Nav.Link href="#pricing">Contact Us</Nav.Link>
          </Nav>
      </Navbar>
        <Container>
          <Row>
            <Col></Col>
            <Col xs={6}>
              <Routes>
              <Route path='/register' Component={PatientRegistration} />
              <Route path='/login' Component={UserLogin} />
              <Route path='/login/pharmacist-loggedin' Component={PharmacistView}/>
              </Routes>
            </Col>
            <Col></Col>
          </Row>
        </Container>
    </Router>
  );
}

export default App;
