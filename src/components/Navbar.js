import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/Navbar.css'; // Import CSS file for styling

const Navbar = () => (
  <nav className="navbar">
    <ul className="navbar-list">
      <li className="navbar-item">
        <Link to="/" className="navbar-link">Home</Link>
      </li>
      <li className="navbar-item">
        <Link to="/properties" className="navbar-link">Properties</Link>
      </li>
      <li className="navbar-item">
        <Link to="/about" className="navbar-link">About</Link>
      </li>
      <li className="navbar-item">
        <Link to="/rental-application" className="navbar-link">Rental Application</Link>
      </li>
      <li className="navbar-item">
        <Link to="/contact" className="navbar-link">Contact</Link>
      </li>
    </ul>
  </nav>
);

export default Navbar;
