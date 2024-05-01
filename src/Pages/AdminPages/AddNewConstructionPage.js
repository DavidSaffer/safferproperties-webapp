import React, { useState, useEffect } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as databaseRef, set, get } from 'firebase/database';
import { storage, database } from '../../index.js'; // Adjust import paths based on your setup
import styles from './CSS/AddPropertyPage.module.css';

import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, MouseSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { SortableItem } from '../../components/SortableItemComponent.js';

const AddNewConstructionForm = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    images: [],
    thumbnailDescription: '',
    propertyType: 'Residential', // Default to Residential
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const savedFormData = sessionStorage.getItem('constructionFormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData)); // Parse the JSON string back to an object
    }
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      const newFormData = { ...prevFormData, [name]: value };
      sessionStorage.setItem('constructionFormData', JSON.stringify(newFormData)); // Save updated form data to session storage
      return newFormData;
    });
  };

  const handleImageUpload = event => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = index => {
    setFormData(prevFormData => ({
      ...prevFormData,
      images: prevFormData.images.filter((_, i) => i !== index),
    }));
  };

  const handleDragEnd = event => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFormData(prevFormData => ({
        ...prevFormData,
        images: arrayMove(prevFormData.images, active.id, over.id),
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
      thumbnailDescription: '',
      propertyType: 'Residential', // Default to Residential
    });
    sessionStorage.removeItem('constructionFormData');
  };

  const addConstruction = async () => {
    setSubmitting(true); // Start submission and show animation
    const { address, bedrooms, bathrooms, description, images, thumbnailDescription, propertyType } = formData;

    const name = address
      .replace(/\s+/g, '-')
      .replace(/[.#$[\]]/g, '')
      .toLowerCase();

    // Check if the name is already used
    const snapshot = await get(databaseRef(database, `newConstruction/${name}`));
    if (snapshot.exists()) {
      alert('Construction with this address already exists!');
      setSubmitting(false); // Stop the animation and enable the button
      return;
    }

    const newConstructionRef = databaseRef(database, `newConstruction/${name}`);
    const imagesUrls = await Promise.all(
      images.map(async (image, index) => {
        const blob = await fetch(image).then(r => r.blob());
        const timestamp = new Date().getTime();
        const fileName = `image_${timestamp}_${index}.jpg`;
        const imageRef = storageRef(storage, `newConstruction/${newConstructionRef.key}/${fileName}`);
        const snapshot = await uploadBytes(imageRef, blob);
        return getDownloadURL(snapshot.ref);
      })
    ).catch(error => {
      console.error('Error uploading images:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to add construction. Please try again. Error: ${error.message}`,
        footer: 'If the problem persists, show this message to david.',
      });
      setSubmitting(false); // Stop the animation and enable the button on error
      return []; // Return empty array to prevent further errors
    });

    // Check if there is at least one image URL for the thumbnail
    const thumbnailImageUrl = imagesUrls.length > 0 ? imagesUrls[0] : null;

    const constructionData = {
      address,
      bedrooms,
      bathrooms,
      description,
      image_urls: imagesUrls,
      thumbnail_image_url: thumbnailImageUrl, // Use the conditional thumbnail image URL
      thumbnail_description: thumbnailDescription,
      property_type: propertyType,
    };

    set(newConstructionRef, constructionData)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Construction Added!',
          showConfirmButton: true,
          timer: 1500,
          timerProgressBar: true,
          willClose: () => {
            //TODO: Redirect oce page is built for it
            navigate(`/new-construction/${name}`); // Redirect to desired page after saving
            //navigate(`/editconstructions/${name}`); // Redirect to desired page after saving
          },
        });
        clearForm();
        setSubmitting(false); // Stop the animation and enable the button
      })
      .catch(error => {
        console.error('Error adding construction:', error);
        setSubmitting(false); // Stop the animation and enable the button
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to add construction. Please try again. Error: ${error.message}`,
          footer: 'If the problem persists, show this message to david.',
        });
      });
  };

  return (
    <div className={styles.formContainer}>
      <h1>Add New Construction</h1>
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
          Thumbnail Description:
          <textarea name="thumbnailDescription" value={formData.thumbnailDescription} onChange={handleInputChange} className={styles.textarea}></textarea>
        </label>
        <label className={styles.label}>
          Property Type:&nbsp;
          <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className={styles.select}>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Vacation">Vacation</option>
          </select>
        </label>

        <div>
          <button type="button" onClick={addConstruction} disabled={submitting} className={styles.button}>
            {submitting ? <div className={styles.spinner}></div> : 'Add Construction'}
          </button>
          <button type="button" onClick={clearForm} className={styles.button}>
            Clear
          </button>
        </div>

        <label className={styles.label}>
          Add Images:&nbsp;
          <input type="file" multiple onChange={handleImageUpload} className={styles.inputFile} accept="image/*" />
        </label>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={formData.images} strategy={verticalListSortingStrategy}>
            {formData.images.map((src, index) => (
              <SortableItem key={index} id={index} src={src} onRemove={() => removeImage(index)} />
            ))}
          </SortableContext>
        </DndContext>
      </form>
    </div>
  );
};

export default AddNewConstructionForm;
