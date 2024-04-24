// PropertyDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get, child } from "firebase/database";
import { database } from '../index.js';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css'; 

import styles from './CSS/PropertyDetails.module.css';

function PropertyDetail() {
  
  const [property, setProperty] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { id } = useParams();

  useEffect(() => {
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

  console.log("image urls", property?.image_urls);

  // Convert the description into a list
  const getDescriptionList = (description) => {
    return description.split('..').map((item, index) => (
      // Ensure that the item is not empty or just whitespace
      item.trim() && <li key={index}>{item.trim()}</li>
    ));
  };

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Property Details</h1>
      <div className={styles.container}>
        <div className={styles.imageGallery}>
          {property.image_urls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Property ${index}`}
              className={styles.image}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>
        {isOpen && (
          <Lightbox 
            mainSrc={property.image_urls[photoIndex]}
            nextSrc={property.image_urls[(photoIndex + 1) % property.image_urls.length]}
            prevSrc={property.image_urls[(photoIndex + property.image_urls.length - 1) % property.image_urls.length]}
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + property.image_urls.length - 1) % property.image_urls.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % property.image_urls.length)
            }
          />
        )}
        <div className={styles.details}>
          <h2>{property.address}</h2>
          <ul>{getDescriptionList(property.description)}</ul>
          <p>Price: ${property.price}</p>
          <p>Status: {property.currently_available ? 'Available' : 'Not Available'}</p>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;