import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ref, get, child } from "firebase/database";
import { database } from '../index.js';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css'; 

import { useAuth } from '../AuthContext.js';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import styles from './CSS/PropertyDetails.module.css';

function PropertyDetail() {
  
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const detailsRef = useRef(null); // Reference to the details section
  const { id } = useParams();

  //const[user] = useAuthState(auth);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const propertyRef = ref(database);
    get(child(propertyRef, `properties/${id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setProperty(snapshot.val());
      } else {
        console.log("No data available");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No property data available',
        }).then(() => {
          navigate('/properties');
        });
      }
    }).catch((error) => {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load property data',
        }).then(() => {
          navigate('/properties');
      });
    });
  }, [id, navigate]);

  useEffect(() => {
    // Update max-height of details section after property data is loaded
    if (property) {
      const detailsHeight = detailsRef.current.scrollHeight;
      detailsRef.current.style.maxHeight = `${detailsHeight}px`;
    }
  }, [property]);

  console.log("image urls", property?.image_urls);

  const getDescriptionList = (description) => {
    return description.split(/(?:\.{2,}|\n+)/).map((item, index) => (
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
    <div className={styles.pageContainer}>
      <h1>{property.address}</h1>
      <div className={styles.container}>
        {property.image_urls && property.image_urls.length > 0 ? (
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
      ) : (
        <div className={styles.noImages}>No images available</div>
      )}
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
        <div ref={detailsRef} className={styles.details}>
          <h2>{property.address}</h2>
          <ul>{getDescriptionList(property.description)}</ul>
          <p>Price: ${property.price}</p>
          <p>Status: {property.currently_available ? 'Available' : 'Not Available'}</p>
          {property.currently_available && ( // Check if property is available
            <Link to={`/rental-application?address=${encodeURIComponent(property.address)}`}>
              <button className={styles.applyButton}>Apply Now</button> {/* Apply button with styles */}
            </Link>
          )}
          {isAdmin && (
            <Link to={`/editproperties/${id}`}>
              <button className={styles.editButton}>Edit Property</button> {/* Edit button with styles */}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;
