import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../index.js';
import { useLocation } from 'react-router-dom';

import PropertyCard from '../components/PropertyCard';

import styles from './CSS/PropertiesPage.module.css';

import { motion } from 'framer-motion';

function PropertiesPage() {
  const location = useLocation(); // Access location object from react-router-dom
  const queryParams = new URLSearchParams(location.search); // Get query parameters from URL
  const filterAvailableParam = queryParams.get('filter');

  const [properties, setProperties] = useState([]);
  const [filterAvailable, setFilterAvailable] = useState(filterAvailableParam === 'available');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  useEffect(() => {
    setIsLoading(true);
    const propertiesRef = ref(database, 'properties/');
    onValue(propertiesRef, snapshot => {
      const data = snapshot.val();
      const propertyList = [];
      for (let id in data) {
        propertyList.push({ id, ...data[id] });
      }
      setProperties(propertyList);
    });
    setIsLoading(false);
  }, []);

  const filteredProperties = properties.filter(property => {
    if (filterAvailable && !property.currently_available) {
      return false;
    }
    if (selectedPropertyType && property.property_type !== selectedPropertyType) {
      return false;
    }
    return true;
  });

  const handlePropertyTypeChange = event => {
    setSelectedPropertyType(event.target.value);
  };

  return (
    <>
      <div className={styles.container}>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          Properties
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <div className={styles.filterSection}>
            <label>
              <input type="checkbox" checked={filterAvailable} onChange={() => setFilterAvailable(!filterAvailable)} /> Only show available properties
            </label>
          </div>
          <div className={styles.filterSection}>
            <label>Property Type: </label>
            <select value={selectedPropertyType} onChange={handlePropertyTypeChange}>
              <option value="">All</option>
              <option value="Residential">Residential</option>
              <option value="Vacation">Vacation</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
        </motion.div>
        {isLoading ? (
          <div>Loading properties...</div>
        ) : (
          <motion.ul layout variants={containerVariants} initial="hidden" animate="visible" className={styles.propertiesList}>
            {filteredProperties.map(property => (
              <motion.li key={property.id} variants={itemVariants}>
                <PropertyCard property={property} linkTo={`/properties/${property.id}`} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </>
  );
}

export default PropertiesPage;
