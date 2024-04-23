import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../index.js'; 
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { useAuth } from '../AuthContext.js';
import './CSS/Navbar.css'; // Import CSS file for styling

const Navbar = () => {
  const [user] = useAuthState(auth);
  const { isAdmin } = useAuth();

  const logout = () => {
    auth.signOut();
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error('Error logging in with Google', error);
      });
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#ffcc00' : '#fff', // Change color to yellow when active
    //textShadow: isActive ? '0 0 4px #ffcc00' : 'none' // Optional: add shadow for emphasis
  });

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <NavLink to="/" className="navbar-link" end style={linkStyle}>
            Home
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink to="/properties" className="navbar-link" style={linkStyle}>
            Properties
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink to="/about" className="navbar-link" style={linkStyle}>
            About
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink to="/rental-application" className="navbar-link" style={linkStyle}>
            Rental Application
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink to="/contact" className="navbar-link" style={linkStyle}>
            Contact
          </NavLink>
        </li>
        {isAdmin && (
          <li className="navbar-item">
            <NavLink to="/addproperty" className="navbar-link" style={linkStyle}>
              Add Property
            </NavLink>
          </li>
        )}
        {isAdmin && (
          <li className="navbar-item">
            <NavLink to="/editproperties" className="navbar-link" style={linkStyle}>
              Edit Properties
            </NavLink>
          </li>
        )}
      </ul>
      {user ? (
        <ul className="navbar-list auth-links">
          <li className="navbar-item">
            <span className="navbar-link">{user.displayName || "User"}</span>
            <span className={isAdmin ? "admin-status admin" : "admin-status not-admin"}>{isAdmin ? "Admin" : "Not Admin"}</span>
          </li>
          <li className="navbar-item"><button onClick={logout} className="navbar-link">Logout</button></li>
        </ul>
      ) : (
        <ul className="navbar-list auth-links">
          <li className="navbar-item">
            <button onClick={signInWithGoogle} className="navbar-link">Login with Google</button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
