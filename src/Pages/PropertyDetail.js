import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ref, get, child, update } from 'firebase/database';
import { database } from '../index.js';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';

import { useAuth } from '../AuthContext.js';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import styles from './CSS/PropertyDetails.module.css';

import Masonry from '@mui/lab/Masonry';

function PropertyDetail() {
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
    get(child(propertyRef, `properties/${id}`))
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

  const toggleAvailability = () => {
    const newAvailability = !property.currently_available;

    // Update the state locally first
    setProperty(prevProperty => ({
      ...prevProperty,
      currently_available: newAvailability,
    }));

    // Construct the path to the property data in Firebase
    const propertyRef = ref(database, `properties/${id}`);

    // Update the property in Firebase
    update(propertyRef, { currently_available: newAvailability })
      .then(() => {
        console.log('Property availability updated successfully!');
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Property availability has been successfully updated.',
          timer: 3000, //close automatically after 3 seconds
          timerProgressBar: true,
        });
      })
      .catch(error => {
        console.error('Failed to update property availability:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Update',
          text: `Could not update property availability in the database.Please try again. Error: ${error.message}`,
          footer: 'If the problem persists, show this message to david.',
        });

        // Revert state change if the database update fails
        setProperty(prevProperty => ({
          ...prevProperty,
          currently_available: !newAvailability,
        }));
      });
  };

  useEffect(() => {
    // Update max-height of details section after property data is loaded
    if (property) {
      const detailsHeight = detailsRef.current.scrollHeight;
      detailsRef.current.style.maxHeight = `${detailsHeight}px`;
    }
  }, [property]);

  const updateColumns = () => {
    const width = window.innerWidth;
    console.log('Window width:', width);
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

  const convertPriceToCurrency = price => {
    // Regular expression to check if the price is only numbers and at most one decimal point
    if (/^\d*\.?\d*$/.test(price)) {
      const newPrice = parseFloat(price);
      if (!isNaN(newPrice)) {
        return newPrice.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        });
      }
    }
    // Return the original price if it contains any characters other than numbers and a decimal point
    return price;
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
          {property.currently_available && <p>Price: {convertPriceToCurrency(property.price)}</p>}
          <p>Status: {property.currently_available ? 'Available' : 'Not Available'}</p>
          {property.currently_available && ( // Check if property is available
            <Link to={`/rental-application?address=${encodeURIComponent(property.address)}`} className={styles.applyButton}>
              Apply Now
            </Link>
          )}
          <hr />
          <p>Admin Features</p>
          {isAdmin && (
            <>
              <div className={styles.buttonContainer}>
                <button onClick={toggleAvailability} className={styles.editButton}>
                  Toggle Availability
                </button>
                <button onClick={() => navigate(`/editproperties/${id}`)} className={styles.editButton}>
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

export default PropertyDetail;
