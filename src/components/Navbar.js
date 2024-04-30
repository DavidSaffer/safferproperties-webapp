import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../index.js';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { useAuth } from '../AuthContext.js';

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './CSS/Navbar.css'; // Import CSS file for styling

import logo from '../Assets/logo5.png';

const MyNavbar = () => {
  const [user] = useAuthState(auth);
  const { isAdmin } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const logout = () => {
    auth.signOut();
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error('Error logging in with Google', error);
      });
  };

  return (
    <Navbar bg="dark" variant="dark" sticky="top" expand="xl" expanded={expanded}>
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" onClick={() => setExpanded(false)}>
          <img src={logo} style={{ maxWidth: '80px' }} alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle onClick={() => setExpanded(expanded => !expanded)} aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/properties" onClick={() => setExpanded(false)}>
              Properties
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" onClick={() => setExpanded(false)}>
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact" onClick={() => setExpanded(false)}>
              Contact
            </Nav.Link>
            <Nav.Link as={NavLink} to="/rental-application" onClick={() => setExpanded(false)}>
              Rental Application
            </Nav.Link>
            {isAdmin && (
              <Nav.Link as={NavLink} to="/addproperty" onClick={() => setExpanded(false)}>
                Add Property
              </Nav.Link>
            )}
            {/* {isAdmin && (
              <Nav.Link as={NavLink} to="/editproperties" onClick={() => setExpanded(false)}>
                Edit Properties
              </Nav.Link>
            )} */}
          </Nav>

          <Nav className="ms-auto">
            {user ? (
              <>
                <NavDropdown title={user.displayName || 'User'} id="collasible-nav-dropdown">
                  {isAdmin && <NavDropdown.Header>Admin</NavDropdown.Header>}
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link onClick={signInWithGoogle}>Login with Google</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
