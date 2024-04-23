import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get, child, update, remove } from "firebase/database";
import { database } from '../../index.js';
import styles from './CSS/EditPropertyDetails.module.css';

import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function EditPropertyDetails() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    description: '',
    price: '',
    currentlyAvailable: false,
    propertyType: 'Residential',
    thumbnailDescription: '',
    images: [],
  });
  const { id } = useParams();

  useEffect(() => {
    const propertyRef = ref(database, `properties/${id}`);
    get(propertyRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setFormData({
          address: data.address,
          description: data.description,
          price: data.price,
          currentlyAvailable: data.currently_available,
          propertyType: data.property_type || 'Residential',
          thumbnailDescription: data.thumbnail_description || '',
          images: data.image_urls || [],
        });
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const propertyRef = ref(database, `properties/${id}`);
    await update(propertyRef, formData).then(() => {
      console.log('Data updated successfully!');
      setLoading(false);
    }).catch((error) => {
      console.error('Error updating data:', error);
      setLoading(false);
    });
  };

  const handleDelete = async () => {
    // Use SweetAlert to confirm deletion
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this property!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setLoading(true);
      const propertyRef = ref(database, `properties/${id}`);
      remove(propertyRef).then(() => {
        Swal.fire(
          'Deleted!',
          'Your property has been deleted.',
          'success'
        );
        navigate('/editproperties'); // Change to your actual route
      }).catch((error) => {
        Swal.fire(
          'Error!',
          'An error occurred while deleting the property.',
          'error'
        );
        console.error('Error deleting property:', error);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <div>
      <h1>Edit Details</h1>
      <div className={styles.container}>
        <div className={styles.imageGallery}>
          {formData.images.map((url, index) => (
            <img key={index} src={url} alt={`Property ${index}`} className={styles.image} />
          ))}
        </div>
        <div className={styles.details}>
          <label htmlFor="address" className={styles.label}>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={styles.input} />

          <label htmlFor="description" className={styles.label}>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} className={styles.textarea} />

          <label htmlFor="price" className={styles.label}>Price:</label>
          <input type="text" name="price" value={formData.price} onChange={handleInputChange} className={styles.input} />

          <label htmlFor="currentlyAvailable" className={styles.label}>Status:</label>
          <select name="currentlyAvailable" value={formData.currentlyAvailable} onChange={handleInputChange} className={styles.select}>
            <option value={true}>Available</option>
            <option value={false}>Not Available</option>
          </select>

          <label htmlFor="propertyType" className={styles.label}>Property Type:</label>
          <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className={styles.select}>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
          </select>

          <label htmlFor="thumbnailDescription" className={styles.label}>Thumbnail Description:</label>
          <textarea name="thumbnailDescription" value={formData.thumbnailDescription} onChange={handleInputChange} className={styles.textarea}></textarea>

          <button onClick={handleSave} disabled={loading} className={styles.button}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleDelete} disabled={loading} className={styles.button}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPropertyDetails;
