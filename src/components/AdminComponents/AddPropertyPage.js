import React, { useState } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as databaseRef, push, set } from 'firebase/database';
import { storage, database } from '../../index.js'; // Adjust import paths based on your setup

import styles from './CSS/AddPropertyPage.module.css';

const AddPropertyForm = () => {
  const [formData, setFormData] = useState({
    address: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      images: e.target.files
    });
  };

  const clearForm = () => {
    setFormData({
      address: '',
      bedrooms: '',
      bathrooms: '',
      description: '',
      images: []
    });
  };

  const addProperty = async () => {
    const { address, bedrooms, bathrooms, description, images } = formData;
    // Push new property to database
    const newPropertyRef = push(databaseRef(database, 'properties'));
    const imagesUrls = await Promise.all(
      [...images].map(async (image) => {
        const imageRef = storageRef(storage, `properties/${newPropertyRef.key}/${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        return getDownloadURL(snapshot.ref);
      })
    );

    const propertyData = {
      address,
      bedrooms,
      bathrooms,
      description,
      images: imagesUrls
    };

    set(newPropertyRef, propertyData)
      .then(() => {
        alert('Property added successfully!');
        clearForm();
      })
      .catch((error) => {
        console.error('Error adding property:', error);
      });
  };

  return (
    <div className={styles.formContainer}> {/* Use styles from CSS module */}
      <h1>Add New Property</h1>
      <form>
        <label className={styles.label}>
          Address:
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={styles.input} />
        </label>
        <label className={styles.label}>
          Bedrooms:
          <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className={styles.input} />
        </label>
        <label className={styles.label}>
          Bathrooms:
          <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className={styles.input} />
        </label>
        <label className={styles.label}>
          Description:
          <textarea name="description" value={formData.description} onChange={handleInputChange} className={styles.textarea}></textarea>
        </label>
        <label className={styles.label}>
          Upload Images:
          <input type="file" multiple onChange={handleFileChange} className={styles.inputFile} />
        </label>
        <div>
          <button type="button" onClick={addProperty} className={styles.button}>Add Property</button>
          <button type="button" onClick={clearForm} className={styles.button}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;
