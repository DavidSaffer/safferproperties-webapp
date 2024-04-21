// PropertyDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get, child } from "firebase/database";
import { database } from '../../index.js';

import styles from './CSS/EditPropertyDetails.module.css';

function EditPropertyDetails() {
  const [property, setProperty] = useState(null);
  const { id } = useParams(); // This hook allows us to access the ID passed in the URL

  useEffect(() => {
    console.log(id);
    const propertyRef = ref(database);
    get(child(propertyRef, `properties/${id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setProperty(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [id]);

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Property Details</h1>
      <div className={styles.container}>
        <div className={styles.imageGallery}>
          {property.image_urls.map((url, index) => (
            <img key={index} src={url} alt={`Property ${index}`} className={styles.image} />
          ))}
        </div>
        <div className={styles.details}>
          <h2>{property.address}</h2>
          <p>{property.description}</p>
          <p>Price: ${property.price}</p>
          <p>Status: {property.currentley_available ? 'Available' : 'Not Available'}</p>
        </div>
      </div>
    </div>
  );
}

export default EditPropertyDetails;
