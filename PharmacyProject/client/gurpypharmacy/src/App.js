
//importing styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
//importing custom components
import PatientRegistration from './pages/registrationPage';
import UserLogin from './pages/loginPage';
import MedicationProfile from './pages/patientMedicationProfile';
import backgroundImage from './images/backgroundImage.png';
import homePageBackground from './images/homePageBackground.png';
import Dashboard from './pages/dashboard';
import NavbarComponent from './pages/navBar';
import { decodeToken,getToken } from "./pages/tokenUtils";
//importing bootstrap components
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

  // State to track if the user is logged in and the user's name
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        console.log(decodedToken);
        setIsLoggedIn(true);
        setUserName(decodedToken.userType); 
      }
    }
  }, []);

  async function logout() {
    // Call to server to destroy the session
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'GET',
      });
  
      if (response.ok) {
        // Remove the token from local storage

        localStorage.removeItem('userToken');
    
        setIsLoggedIn(false);
        setUserName('');
        // Redirect the user to the home page
        window.location.href = '/';
      } else {
        console.error('Failed to log out.');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  return (
    <div>
      <Router>
        <NavbarComponent isLoggedIn={isLoggedIn} userName={userName} onLogout={logout}/>
          <Container>
            <Row>
              <Col></Col>
              <Col xs={8} md={10} xl={10}>
                <Dashboard />
                <Routes>
                <Route path='/' />
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
