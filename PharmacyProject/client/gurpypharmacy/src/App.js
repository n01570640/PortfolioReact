
//importing styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
//importing custom components
import PatientRegistration from './pages/registrationPage';
import UserLogin from './pages/loginPage';
import MedicationProfile from './pages/patientMedicationProfile';

//importing bootstrap components
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PharmacistView from './pages/pharmacistView';
import PatientView from './pages/patientView';
import ProtectedRoute from './pages/protectedRoute'; 
import AdministrationView from './pages/Administration/administrationView';
import 'primeicons/primeicons.css';
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
            <Col xs={8} md={10} xl={10}>
              <Routes>
              <Route path='/register' Component={PatientRegistration} />
              <Route path='/login' Component={UserLogin} />
              <Route path="/patient-view" element={
                    <ProtectedRoute component={PatientView} allowedUserTypes={['Patient', 'Pharmacist']} />
                } />
                <Route path="/login/pharmacist-loggedin" element={
                    <ProtectedRoute component={PharmacistView} allowedUserTypes={['Pharmacist']} />
                } />
                <Route path="/medicationProfile/:patientId" element={<MedicationProfile />} />
                <Route path="/admin" element={
                    <ProtectedRoute component={AdministrationView} allowedUserTypes={['Admin']} />
                } />
              </Routes>
            </Col>
            <Col></Col>
          </Row>
        </Container>
    </Router>
  );
}

export default App;
