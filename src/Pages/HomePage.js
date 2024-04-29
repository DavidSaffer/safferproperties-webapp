import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../index.js';
import { Link } from 'react-router-dom';

import PropertyCard from '../components/PropertyCard';
import logo from '../Assets/logo6.png';

import styles from './CSS/HomePage.module.css';

function HomePage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const propertiesRef = ref(database, 'properties/');
    onValue(propertiesRef, snapshot => {
      const data = snapshot.val();
      const propertyList = [];
      for (let id in data) {
        propertyList.push({ id, ...data[id] });
      }
      // Setting properties to first three entries only
      setProperties(propertyList.slice(0, 2));
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <img src={logo} alt="Company Logo" className={styles.logo} />
        <Link
          to="/properties?filter=available"
          style={{ textDecoration: 'none' }}
        >
          <button className={styles.ctaButton}>
            Currently Available Properties
          </button>
        </Link>
      </div>
      <div className={styles.featureSection}>
        <h2>Featured Properties</h2>
        <div className={styles.propertiesList}>
          {properties.map(property => (
            <li key={property.id} className={styles.propertyCard}>
              <PropertyCard
                key={property.id}
                property={property}
                linkTo={`/properties/${property.id}`}
              />
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
