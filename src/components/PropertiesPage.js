import React, { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { database } from '../index.js';
import { Link, useLocation } from 'react-router-dom';

import styles from './CSS/PropertiesPage.module.css';

function PropertiesPage() {
  const location = useLocation(); // Access location object from react-router-dom
  const queryParams = new URLSearchParams(location.search); // Get query parameters from URL
  const filterAvailableParam = queryParams.get('filter');


  const [properties, setProperties] = useState([]);
  const [filterAvailable, setFilterAvailable] = useState(filterAvailableParam === 'available');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');

  useEffect(() => {
    console.log("Fetching data from Firebase");
    const propertiesRef = ref(database, 'properties/');
    console.log("propertiesRef:", propertiesRef); // Log the reference (optional
    onValue(propertiesRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Data retrieved from Firebase:", data); // Log the raw data
      const propertyList = [];
      for (let id in data) {
        propertyList.push({ id, ...data[id] });
      }
      setProperties(propertyList);
    });
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

  const handlePropertyTypeChange = (event) => {
    setSelectedPropertyType(event.target.value);
  };

  return (
    <div className={styles.container}>
      <h1>Properties</h1>
      <div className={styles.filterSection}>
        <label>
          <input
            type="checkbox"
            checked={filterAvailable}
            onChange={() => setFilterAvailable(!filterAvailable)}
          />
          Only show available properties
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
      <ul className={styles.propertiesList}>
        {filteredProperties.map(property => (
          <li key={property.id} className={styles.propertyCard}>
            <Link to={`/properties/${property.id}`}>
              <img src={property.thumbnail_image_url} alt="Thumbnail" />
              <div className={styles.propertyCardContent}>
                <h2>{property.address}</h2>
                <p>{property.bedrooms} Bedrooms | {property.bathrooms} Bathrooms</p>
                <p>{property.thumbnail_description}</p>
                {/* <p>${property.price}</p> */}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PropertiesPage;
