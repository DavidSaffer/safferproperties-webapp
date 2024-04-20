import React, { useState } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as databaseRef, push, set } from 'firebase/database';
import { storage, database } from '../../index.js'; // Adjust import paths based on your setup
import styles from './CSS/AddPropertyPage.module.css';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    MouseSensor 
  } from '@dnd-kit/core';
  import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    sortableKeyboardCoordinates,
  } from '@dnd-kit/sortable';
  
  // Assuming SortableItem is correctly defined and exported in SortableItemComponent.js
  import { SortableItem } from '../SortableItemComponent';

const AddPropertyForm = () => {
  const [formData, setFormData] = useState({
    address: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    images: [],
    currentleyAvailable: false
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFormData(prevFormData => ({
        ...prevFormData,
        images: arrayMove(prevFormData.images, active.id, over.id)
      }));
    }
  };

  const clearForm = () => {
    setFormData({
      address: '',
      bedrooms: '',
      bathrooms: '',
      description: '',
      images: [],
      currentleyAvailable: false
    });
  };

  const addProperty = async () => {
    const { address, bedrooms, bathrooms, description, images } = formData;
    const newPropertyRef = push(databaseRef(database, 'properties'));
    const imagesUrls = await Promise.all(
      images.map(async (image, index) => {
        const blob = await fetch(image).then(r => r.blob());
        const timestamp = new Date().getTime();
        const fileName = `image_${timestamp}_${index}.jpg`; // Assuming JPEGs, adjust accordingly
        const imageRef = storageRef(storage, `properties/${newPropertyRef.key}/${fileName}`);
        const snapshot = await uploadBytes(imageRef, blob);
        return getDownloadURL(snapshot.ref);
      })
    );

    const propertyData = {
      address,
      bedrooms,
      bathrooms,
      description,
      image_urls: imagesUrls,
      currentley_available: formData.currentleyAvailable,
      thumbnail_image_url: imagesUrls[0] // Assuming the first image is the thumbnail
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
    <div className={styles.formContainer}>
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
            Currently Available:
            <input
                type="checkbox"
                name="currentlyAvailable"
                checked={formData.currentlyAvailable}
                onChange={e => setFormData({ ...formData, currentlyAvailable: e.target.checked })}
                className={styles.checkbox}
            />
        </label>
        <label className={styles.label}>
          Upload Images:
          <input type="file" multiple onChange={handleImageUpload} className={styles.inputFile} accept="image/*" />
        </label>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={formData.images} strategy={verticalListSortingStrategy}>
            {formData.images.map((src, index) => (
              <SortableItem key={index} id={index} src={src} />
            ))}
          </SortableContext>
        </DndContext>
        <div>
          <button type="button" onClick={addProperty} className={styles.button}>Add Property</button>
          <button type="button" onClick={clearForm} className={styles.button}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;
