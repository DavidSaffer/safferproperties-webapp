import './App.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your custom components
import Navbar from './components/Navbar';
import Home from './Pages/HomePage.js';
import About from './Pages/AboutPage.js';
import Properties from './Pages/PropertiesPage.js';
import RentalApplication from './Pages/RentalAppPage.js';
import Contact from './Pages/ContactPage.js';
import PropertyDetail from './Pages/PropertyDetail.js';

//Admin
import AddProperty from './Pages/AdminPages/AddPropertyPage.js';
import AddNewConstruction from './Pages/AdminPages/AddNewConstructionPage.js';
//import EditProperties from './Pages/AdminPages/EditPropertiesPage.js';
import EditPropertyDetails from './Pages/AdminPages/EditPropertyDetails.js';
import ConstructionPage from './Pages/ConstructionPage.js';
import ConstructionDetails from './Pages/ConstructionDetails.js';
import EditConstructionDetails from './Pages/AdminPages/EditConstructionDetails.js';

import BlogPage from './Pages/BlogPage.js';

// User Auth
// import { auth } from './index';
// import { database } from './index';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { ref, get, child} from 'firebase/database';
import { useAuth } from './AuthContext.js';

function App() {
  const { isAdmin } = useAuth();

  return (
    <>
      <div>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/new-construction" element={<ConstructionPage />} />
            <Route path="/rental-application" element={<RentalApplication />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/new-construction/:id" element={<ConstructionDetails />} />
            <Route path="/blog" element={<BlogPage />} />
            {isAdmin && <Route path="/addproperty" element={<AddProperty />} />}
            {/* {isAdmin && <Route path="/editproperties" element={<EditProperties />} />} */}
            {isAdmin && <Route path="/addnewconstruction" element={<AddNewConstruction />} />}
            {isAdmin && <Route path="/editproperties/:id" element={<EditPropertyDetails />} />}
            {isAdmin && <Route path="/edit-construction/:id" element={<EditConstructionDetails />} />}

          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
