import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

function NavbarComponent({ isLoggedIn, userName, onLogout }) {
  return (
    <Navbar className="navbar">
      <Navbar.Brand href="/">Gurpy's Pharmacy</Navbar.Brand>
      <Nav className="me-auto">
        {!isLoggedIn && <Nav.Link href="/login">Log-In</Nav.Link>}
        {!isLoggedIn && <Nav.Link href="/register">Patient's Sign up with us</Nav.Link>}
        {isLoggedIn && (
          <>
            <Nav.Link onClick={onLogout}>Logout</Nav.Link>
            <h2>Welcome {userName}</h2>
          </>
        )}

      </Nav>
    </Navbar>
  );
}

export default NavbarComponent;
