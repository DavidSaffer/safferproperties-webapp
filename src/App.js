import './App.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your custom components
import Navbar from './components/Navbar';
import Home from './components/HomePage';
import About from './components/AboutPage';
import Properties from './components/PropertiesPage';
import RentalApplication from './components/RentalAppPage';
import Contact from './components/ContactPage';


function App() {
  return (
    <>
      <div>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/rental-application" element={<RentalApplication />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
