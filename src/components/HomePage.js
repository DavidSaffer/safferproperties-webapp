import React from 'react';
import logo from '../Assets/logo.jpg'; // Path to logo image
import { Link } from 'react-router-dom';


function HomePage() {
  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <img src={logo} alt="Company Logo" style={styles.logo} />
        <h1>Welcome to Our Property Management Service</h1>
        <p>Explore our properties, find resources, and connect with us for all your property needs.</p>
        <Link to="/properties?filter=available" style={{ textDecoration: 'none' }}>
          <button style={styles.ctaButton}>Currently Available Properties</button>
        </Link>
      </div>
      <div style={styles.featureSection}>
        <h2>Featured Properties</h2>
        {/* Example placeholders for properties */}
        <div style={styles.propertiesList}>
          <div style={styles.propertyCard}>Property 1</div>
          <div style={styles.propertyCard}>Property 2</div>
          <div style={styles.propertyCard}>Property 3</div>
        </div>
      </div>
    </div>
  );
}

// Inline CSS styles
const styles = {
  container: {
    textAlign: 'center',
    color: '#333',
  },
  heroSection: {
    padding: '50px 20px',
    backgroundColor: '#f8f9fa',
  },
  logo: {
    maxWidth: '200px',
    height: 'auto',
  },
  ctaButton: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  },
  featureSection: {
    padding: '20px',
    backgroundColor: '#ffffff',
  },
  propertiesList: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
  },
  propertyCard: {
    width: '30%',
    padding: '20px',
    margin: '10px',
    backgroundColor: '#eeeeee',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  }
};

export default HomePage;
