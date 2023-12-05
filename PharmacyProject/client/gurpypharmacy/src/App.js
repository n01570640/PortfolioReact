
//importing styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

//importing custom components
import PatientRegistration from './pages/registrationPage';
import UserLogin from './pages/loginPage';
import MedicationProfile from './pages/patientMedicationProfile';
import backgroundImage from './images/backgroundImage.png';
import homePageBackground from './images/homePageBackground.png';
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

  const baseUrl = `${window.location.protocol}//${window.location.host}/`;
  const currentUrl = window.location.href;
  const isLocationBaseUrl = currentUrl === baseUrl;
  const bodyElement = document.body;

  if (isLocationBaseUrl) {
      bodyElement.style.backgroundImage = `url(${homePageBackground})`;
  } else {
      bodyElement.style.backgroundImage = `url(${backgroundImage})`;
  }
  async function logout() {
    // Remove the token from local storage
    localStorage.removeItem('token');
    // Redirect the user to the login page or home page
    window.location.href = '/';
}


  return (
    <div>
      <Router>
        <Navbar className="navbar">
        <Navbar.Brand href="/">Gurpy's Pharmacy</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/login">Log-In</Nav.Link>
              <Nav.Link href="/register">Patient's Sign up with us</Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
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
      </div>
  );
}

export default App;
