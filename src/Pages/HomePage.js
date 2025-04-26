import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../index.js';
import { Link } from 'react-router-dom';

import PropertyCard from '../components/PropertyCard';
import logo from '../Assets/logo6.png';

import styles from './CSS/HomePage.module.css';

import { motion } from 'framer-motion';

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
      // Names of the properties you want to feature
      const featuredNames = ['2811 Old Lee Highway Fairfax, VA '];

      // Filter properties by names listed in featuredNames
      const featuredProperties = propertyList.filter(property =>
        featuredNames.includes(property.address)
      );

      // Set featured properties to state
      setProperties(featuredProperties);
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.3, duration: 0.5 } },
  };

  return (
    <motion.div
      className={styles.container}
      initial="hidden"
      animate="visible"
      variants={containerVariants}>
      <div className={styles.heroSection}>
        <motion.img
          src={logo}
          alt="Company Logo"
          className={styles.logo}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
        />
        <Link
          to="/properties?filter=available"
          style={{ textDecoration: 'none' }}>
          <button className={styles.ctaButton}>
            Currently Available Properties
          </button>
        </Link>
      </div>
      <div className={styles.featureSection}>
        <h2>Featured Properties</h2>
        <div className={styles.propertiesList}>
          {properties.map(property => (
            <motion.li
              key={property.id}
              className={styles.propertyCard}
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.5 + properties.indexOf(property) * 0.2,
                  type: 'spring',
                  stiffness: 50,
                },
              }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
              <PropertyCard
                key={property.id}
                property={property}
                linkTo={`/properties/${property.id}`}
              />
            </motion.li>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default HomePage;
