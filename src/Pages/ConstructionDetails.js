import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get, child } from 'firebase/database';
import { database } from '../index.js';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';

import { useAuth } from '../AuthContext.js';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import styles from './CSS/PropertyDetails.module.css';

import Masonry from '@mui/lab/Masonry';

function ConstructionDetails() {
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const detailsRef = useRef(null); // Reference to the details section
  const { id } = useParams();
  const [numColumns, setNumColumns] = useState(3);

  //const[user] = useAuthState(auth);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const propertyRef = ref(database);
    get(child(propertyRef, `newConstruction/${id}`))
      .then(snapshot => {
        if (snapshot.exists()) {
          setProperty(snapshot.val());
        } else {
          console.log('No data available');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No property data available',
          }).then(() => {
            navigate('/properties');
          });
        }
      })
      .catch(error => {
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

  const updateColumns = () => {
    const width = window.innerWidth;
    // Here you define how you determine the number of columns based on width
    // This is a simple example that sets more columns for wider screens
    if (width >= 2000) {
      setNumColumns(3);
    } else if (width >= 900) {
      setNumColumns(3);
    } else {
      setNumColumns(2);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateColumns);
    updateColumns(); // Initial call to set the columns

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const getRoomInfo = () => {
    const bedroomsInfo = property.bedrooms ? `${property.bedrooms} Bedrooms` : '';
    const bathroomsInfo = property.bathrooms ? `${property.bathrooms} Bathrooms` : '';
    const separator = property.bedrooms && property.bathrooms ? ' | ' : '';

    return `${bedroomsInfo}${separator}${bathroomsInfo}` || '';
  };


  const getDescriptionList = description => {
    return description.split(/(?:\.{2,}|\n+)/).map(
      (item, index) =>
        // Ensure that the item is not empty or just whitespace
        item.trim() && <li key={index}>{item.trim()}</li>
    );
  };

  const openLightbox = index => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.imageGallery}>
          {property.image_urls && property.image_urls.length > 0 ? (
            <Masonry columns={numColumns} spacing={2}>
              {property.image_urls.map((url, index) => (
                <img key={index} src={url} alt={`Property ${index}`} className={styles.image} onClick={() => openLightbox(index)} />
              ))}
            </Masonry>
          ) : (
            <div className={styles.noImages}>No images available</div>
          )}
        </div>
        {isOpen && (
          <Lightbox
            mainSrc={property.image_urls[photoIndex]}
            nextSrc={property.image_urls[(photoIndex + 1) % property.image_urls.length]}
            prevSrc={property.image_urls[(photoIndex + property.image_urls.length - 1) % property.image_urls.length]}
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() => setPhotoIndex((photoIndex + property.image_urls.length - 1) % property.image_urls.length)}
            onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % property.image_urls.length)}
            reactModalStyle={{ overlay: { zIndex: 9999 } }} // Set the zIndex to a high value
          />
        )}
        <div ref={detailsRef} className={styles.details}>
          <h2>{property.address}</h2>
          {getRoomInfo() && <p>{getRoomInfo()}</p>}
          <ul>{getDescriptionList(property.description)}</ul>
          
          {isAdmin && (
            <>
              <hr />
              <p>Admin Features</p>
              <div className={styles.buttonContainer}>
                <button onClick={() => navigate(`/edit-construction/${id}`)} className={styles.editButton}>
                  Edit Property
                </button>
                {/* <Link to={`/editproperties/${id}`} className={styles.editButton}>
                  Edit Property
                </Link> */}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConstructionDetails;
