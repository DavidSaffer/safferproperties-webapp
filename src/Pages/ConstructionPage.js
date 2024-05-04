import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../index.js';

import PropertyCard from '../components/PropertyCard';

import styles from './CSS/PropertiesPage.module.css';

import { motion } from 'framer-motion';

function ConstructionPage() {

  const [properties, setProperties] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const filterPropertyTypeFromStorage = sessionStorage.getItem('constructionSelectedPropertyType') || '';

  const headerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5, // Duration of the animation
        delay: 0.2, // Starts after 0.2 seconds
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
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
    const propertiesRef = ref(database, 'newConstruction/');
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

  // Load selected property type from session storage
  useEffect(() => {
    setSelectedPropertyType(filterPropertyTypeFromStorage);
  }, [filterPropertyTypeFromStorage]);


  const filteredProperties = properties.filter(property => {
    if (selectedPropertyType && property.property_type !== selectedPropertyType) {
      return false;
    }
    return true;
  });

  const handlePropertyTypeChange = event => {
    setSelectedPropertyType(event.target.value);
    sessionStorage.setItem('constructionSelectedPropertyType', event.target.value);
  };

  return (
    <>
      <div className={styles.container}>
        <motion.h1 className={styles.title} variants={headerVariants} initial="hidden" animate="visible">
          New Construction
        </motion.h1>
        <motion.div variants={headerVariants} initial="hidden" animate="visible">
          <div className={styles.filterSection}>
            <label>Construction Type: &nbsp;</label>
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
              <motion.li key={property.id} variants={itemVariants} whileHover={{ scale: 1.05 }} transition={{ duration: 0.02 }}>
                <PropertyCard property={property} linkTo={`/new-construction/${property.id}`} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </>
  );
}

export default ConstructionPage;
