import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get, child, update, remove } from "firebase/database";
import { storage, database } from '../../index.js';
import styles from './CSS/EditPropertyDetails.module.css';

import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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

import { SortableItem } from '../SortableItemComponent';

function EditPropertyDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    description: '',
    price: '',
    currently_available: false,
    property_type: 'Residential',
    thumbnail_description: '',
    image_urls: [],
  });
  const { id } = useParams();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const propertyRef = ref(database, `properties/${id}`);
    get(propertyRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setFormData({
          address: data.address,
          description: data.description,
          price: data.price,
          currently_available: data.currently_available,
          property_type: data.property_type || 'Residential',
          thumbnail_description: data.thumbnail_description || '',
          image_urls: data.image_urls || [],
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
  
    if (name === "currently_available") {
      // Convert string value to boolean before setting state
      const isAvailable = value === "true"; // This will be true if value is "true", false otherwise
      setFormData(prev => ({
        ...prev,
        [name]: isAvailable
      }));
    } else {
      // Handle other inputs normally
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleRemoveImage = (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This image will be removed!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData(prevFormData => ({
          ...prevFormData,
          image_urls: prevFormData.image_urls.filter((_, i) => i !== index)
        }));
        Swal.fire('Removed!', 'The image has been removed.', 'success');
      }
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFormData(prevFormData => ({
        ...prevFormData,
        image_urls: arrayMove(prevFormData.image_urls, active.id, over.id)
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const propertyRef = ref(database, `properties/${id}`);
    formData.thumbnail_image_url = formData.image_urls[0];
    await update(propertyRef, formData).then(() => {
      console.log('Data updated successfully!');
      setLoading(false);
    }).catch((error) => {
      console.error('Error updating data:', error);
      setLoading(false);
    });
  };

  const handleDelete = async () => {
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
        Swal.fire('Deleted!', 'Your property has been deleted.', 'success');
        navigate('/editproperties'); // Change to your actual route
      }).catch((error) => {
        Swal.fire('Error!', 'An error occurred while deleting the property.', 'error');
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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={formData.image_urls} strategy={verticalListSortingStrategy}>
                {formData.image_urls.map((url, index) => (
                  <SortableItem key={index} id={index} src={url} onRemove={() => handleRemoveImage(index)} />
                ))}
              </SortableContext>
            </DndContext>
        </div>
        <div className={styles.details}>
          <label htmlFor="address" className={styles.label}>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={styles.input} />

          <label htmlFor="description" className={styles.label}>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} className={styles.textarea} />

          <label htmlFor="price" className={styles.label}>Price:</label>
          <input type="text" name="price" value={formData.price} onChange={handleInputChange} className={styles.input} />

          <label htmlFor="currently_available" className={styles.label}>Status:</label>
          <select name="currently_available" value={formData.currently_available} onChange={handleInputChange} className={styles.select}>
            <option value={true}>Available</option>
            <option value={false}>Not Available</option>
          </select>

          <label htmlFor="property_type" className={styles.label}>Property Type:</label>
          <select name="property_type" value={formData.property_type} onChange={handleInputChange} className={styles.select}>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
          </select>

          <label htmlFor="thumbnail_description" className={styles.label}>Thumbnail Description:</label>
          <textarea name="thumbnail_description" value={formData.thumbnail_description} onChange={handleInputChange} className={styles.textarea}></textarea>

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