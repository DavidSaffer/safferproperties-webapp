import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get, child, update, remove } from "firebase/database";
import { database } from '../../index.js';

import styles from './CSS/EditPropertyDetails.module.css';

function EditPropertyDetails() {
  const [property, setProperty] = useState(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const propertyRef = ref(database);
    get(child(propertyRef, `properties/${id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setProperty(data);
        setAddress(data.address);
        setDescription(data.description);
        setPrice(data.price);
        setAvailable(data.currently_available);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [id]);

  const handleSave = () => {
    const propertyRef = ref(database, `properties/${id}`);
    update(propertyRef, {
      address,
      description,
      price,
      currently_available: available
    }).then(() => {
      console.log('Data saved successfully!');
    }).catch((error) => {
      console.error(error);
    });
  };

  const handleDelete = () => {
    const propertyRef = ref(database, `properties/${id}`);
    remove(propertyRef).then(() => {
      console.log('Property deleted successfully!');
      // Optionally redirect or update UI here
    }).catch((error) => {
      console.error(error);
    });
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Details</h1>
      <div className={styles.container}>
        <div className={styles.imageGallery}>
          {property.image_urls.map((url, index) => (
            <img key={index} src={url} alt={`Property ${index}`} className={styles.image} />
          ))}
        </div>
        <div className={styles.details}>
          <label htmlFor="address" className={styles.label}>Address:</label>
          <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className={styles.input} />

          <label htmlFor="description" className={styles.label}>Description:</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className={styles.textarea} />

          <label htmlFor="price" className={styles.label}>Price:</label>
          <input type="text" id="price" value={price} onChange={e => setPrice(e.target.value)} className={styles.input} />

          <label htmlFor="available" className={styles.label}>Status:</label>
          <select id="available" value={available} onChange={e => setAvailable(e.target.value === 'true')} className={styles.select}>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>

          <button onClick={handleSave} className={styles.button}>Save</button>
          <button onClick={handleDelete} className={styles.button}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default EditPropertyDetails;
