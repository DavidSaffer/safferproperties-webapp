import React from 'react';
import { Link } from 'react-router-dom';
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
        // This gives you a Google Access Token. You can use it to access Google APIs.
        console.log(result);
        // Optional: navigate to the home page or another page on successful login
      })
      .catch((error) => {
        // Handle Errors here.
        console.error('Error logging in with Google', error);
      });
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/" className="navbar-link">Home</Link></li>
        <li className="navbar-item"><Link to="/properties" className="navbar-link">Properties</Link></li>
        <li className="navbar-item"><Link to="/about" className="navbar-link">About</Link></li>
        <li className="navbar-item"><Link to="/rental-application" className="navbar-link">Rental Application</Link></li>
        <li className="navbar-item"><Link to="/contact" className="navbar-link">Contact</Link></li>
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
