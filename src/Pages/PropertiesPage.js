import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../index.js';
import { useLocation, useNavigate } from 'react-router-dom';

import PropertyCard from '../components/PropertyCard';

import styles from './CSS/PropertiesPage.module.css';

import { motion } from 'framer-motion';

function PropertiesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterAvailableParam = queryParams.get('filter');

  const filterAvailableFromStorage = sessionStorage.getItem('filterAvailable') === 'true';
  const selectedPropertyTypeFromStorage = sessionStorage.getItem('selectedPropertyType') || '';

  const [properties, setProperties] = useState([]);
  const [filterAvailable, setFilterAvailable] = useState(filterAvailableFromStorage);
  const [selectedPropertyType, setSelectedPropertyType] = useState(selectedPropertyTypeFromStorage);
  const [isLoading, setIsLoading] = useState(true);

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

  // Update filters based on query params or session storage
  useEffect(() => {
    if (filterAvailableParam !== null) {
      setFilterAvailable(filterAvailableParam === 'available');
      sessionStorage.setItem('filterAvailable', (filterAvailableParam === 'available').toString());
      setSelectedPropertyType('');
      sessionStorage.setItem('selectedPropertyType', '');
    } else {
      const filterAvailableFromStorage = sessionStorage.getItem('filterAvailable') === 'true';
      setFilterAvailable(filterAvailableFromStorage);
      const propertyTypeFromStorage = sessionStorage.getItem('selectedPropertyType') || '';
      setSelectedPropertyType(propertyTypeFromStorage);
    }
  }, [filterAvailableParam]);

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
    const newPropertyType = event.target.value;
    setSelectedPropertyType(newPropertyType);
    sessionStorage.setItem('selectedPropertyType', newPropertyType);
    navigate('/properties'); // Update the URL without parameters
  };

  const handleFilterChange = () => {
    const newFilterAvailable = !filterAvailable;
    setFilterAvailable(newFilterAvailable);
    sessionStorage.setItem('filterAvailable', newFilterAvailable.toString());
    navigate('/properties'); // Update the URL without parameters
  };

  return (
    <>
      <div className={styles.container}>
        <motion.h1 className={styles.title} variants={headerVariants} initial="hidden" animate="visible">
          Properties
        </motion.h1>
        <motion.div variants={headerVariants} initial="hidden" animate="visible">
          <div className={styles.filterSection}>
            <label>
              <input type="checkbox" checked={filterAvailable} onChange={handleFilterChange} /> Only show available properties
            </label>
          </div>
          <div className={styles.filterSection}>
            <label>Property Type: &nbsp;</label>
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
