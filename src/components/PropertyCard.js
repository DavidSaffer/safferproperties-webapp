import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CSS/PropertyCard.module.css'; // Ensure you have corresponding CSS

function PropertyCard({ property, linkTo }) {
  const getRoomInfo = () => {
    const bedroomsInfo = property.bedrooms
      ? `${property.bedrooms} Bedrooms`
      : '';
    const bathroomsInfo = property.bathrooms
      ? `${property.bathrooms} Bathrooms`
      : '';
    const separator = property.bedrooms && property.bathrooms ? ' | ' : '';

    return `${bedroomsInfo}${separator}${bathroomsInfo}` || '';
  };

  return (
    <div className={styles.propertyCard}>
      <Link to={linkTo}>
        <img src={property.thumbnail_image_url} alt="Thumbnail" />
        <div className={styles.propertyCardContent}>
          <h3>{property.address}</h3>
          <p>{getRoomInfo()}</p>
          <p>{property.thumbnail_description}</p>
        </div>
      </Link>
    </div>
  );
}

export default PropertyCard;
