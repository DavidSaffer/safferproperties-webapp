import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../index.js';
import { Link } from 'react-router-dom';

import styles from './CSS/EditPropertiesPage.module.css';

import Swal from 'sweetalert2';

function EditPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filterAvailable, setFilterAvailable] = useState(false);

  useEffect(() => {
    //console.log("Fetching data from Firebase");
    const propertiesRef = ref(database, 'properties/');
    console.log("propertiesRef:", propertiesRef); // Log the reference (optional
    if (!propertiesRef) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load property data',
      });
    }
    onValue(propertiesRef, snapshot => {
      const data = snapshot.val();
      //console.log("Data retrieved from Firebase:", data); // Log the raw data
      const propertyList = [];
      for (let id in data) {
        propertyList.push({ id, ...data[id] });
      }
      setProperties(propertyList);
    });
  }, []);

  const filteredProperties = filterAvailable ? properties.filter(property => property.currently_available) : properties;

  return (
    <div className={styles.container}>
      <h1>Edit Properties</h1>
      <div className={styles.filterSection}>
        <label>
          <input type="checkbox" checked={filterAvailable} onChange={() => setFilterAvailable(!filterAvailable)} />
          &nbsp;Only show available properties
        </label>
      </div>
      <ul className={styles.propertiesList}>
        {filteredProperties.map(property => (
          <li key={property.id} className={styles.propertyCard}>
            <Link to={`/editproperties/${property.id}`}>
              <img src={property.thumbnail_image_url} alt="Thumbnail" />
              <div className={styles.propertyCardContent}>
                <h2>{property.address}</h2>
                <p>
                  {property.bedrooms} Bedrooms | {property.bathrooms} Bathrooms
                </p>
                <p>{property.thumbnail_description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EditPropertiesPage;
