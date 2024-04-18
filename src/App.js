import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your custom components
import Navbar from './components/Navbar';
import Home from './components/HomePage';
import About from './components/AboutPage';

function App() {
  return (
    <Router>
      < Navbar/>
      <div>
        <Routes>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          {/* <Route path="/properties" component={Properties} />
          <Route path="/rental-application" component={RentalApplication} />
          <Route path="/contact" component={Contact} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
