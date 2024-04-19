import './App.css';

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your custom components
import Navbar from './components/Navbar';
import Home from './components/HomePage';
import About from './components/AboutPage';
import Properties from './components/PropertiesPage';
import RentalApplication from './components/RentalAppPage';
import Contact from './components/ContactPage';
import PropertyDetail from './components/PropertyDetail';


// User Auth
// import { auth } from './index';
// import { database } from './index';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { ref, get, child} from 'firebase/database';
import { useAuth } from './AuthContext.js';



function App() {

  const {isAdmin} = useAuth();
  console.log("isAdmin:", isAdmin);

  // const [user] = useAuthState(auth);
  // console.log("User:", user);

  // useEffect(() => {
  //   if (user) {
  //     const adminRef = ref(database, 'admins/' + user.uid);
  //     get(adminRef).then(snapshot => {
  //       if (snapshot.exists()) {
  //         console.log("User is an admin");
  //       } else {
  //         console.log("User is not an admin");
  //       }
  //     }).catch(error => {
  //       console.error("Failed to check admin status:", error);
  //     });
  //   }
  // }, [user]);  // Only rerun the effect if user changes

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
            <Route path="/properties/:id" element={<PropertyDetail />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
