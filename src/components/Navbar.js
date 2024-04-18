import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-around', padding: '10px', background: '#333', color: '#fff' }}>
        <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link></li>
        <li><Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link></li>
        {/* <li><Link to="/properties" style={{ color: 'white', textDecoration: 'none' }}>Properties</Link></li>
        <li><Link to="/rental-application" style={{ color: 'white', textDecoration: 'none' }}>Rental Application</Link></li>
        <li><Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link></li> */}
      </ul>
    </nav>
  );
}

export default Navbar;
