import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get, update, remove } from 'firebase/database';
import {
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from 'firebase/storage';
import { deleteObject } from 'firebase/storage';
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
  MouseSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import { SortableItem } from '../../components/SortableItemComponent.js';

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
    bedrooms: '',
    bathrooms: '',
    reserve_url: '',
  });
  const { id } = useParams();
  const textareaRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to ensure correct new height calculation
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const propertyRef = ref(database, `properties/${id}`);
    get(propertyRef)
      .then(snapshot => {
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
            bedrooms: data.bedrooms || '',
            bathrooms: data.bathrooms || '',
            reserve_url: data.reserve_url || '',
          });
        } else {
          console.log('No data available');
        }
      })
      .catch(error => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to fetch property details. Please try again. Error: ${error.message}`, // Assuming error has a 'message' property
          footer: 'If the problem persists, show this message to david.',
        });
      });
  }, [id]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [formData.description]);

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    // Convert "true/false" strings to actual boolean values for "currently_available
    if (name === 'currently_available') {
      const isAvailable = value === 'true';
      setFormData(prev => ({
        ...prev,
        [name]: isAvailable,
      }));

      // Handle other inputs normally
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // Add an image to storage, then also add the URL to the reltime databse
  // (this way if the user dosnt hit save, the image is still saved. this prevents images in storage but not in realtime database)
  const handleImageUpload = async e => {
    const files = Array.from(e.target.files); // Handle multiple files
    if (files.length === 0) return;

    // Initialize the progress bar modal
    Swal.fire({
      title: 'Uploading...',
      html: `<progress id="progress-bar" value="0" max="100" style="width: 100%"></progress>`,
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
    });

    const progressBar = document.getElementById('progress-bar'); // Access progress bar element

    const newImageUrls = [...formData.image_urls];
    setLoading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const timestamp = new Date().getTime();
        const fileName = `image_${timestamp}_${newImageUrls.length}.jpg`;
        const newImageRef = storageRef(storage, `properties/${id}/${fileName}`);

        const snapshot = await uploadBytes(newImageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        if (!downloadURL) {
          throw new Error('Failed to get download URL');
        }

        newImageUrls.push(downloadURL); // Add the new URL to the array

        // Update the progress bar
        const progressPercentage = Math.round(((i + 1) / files.length) * 100);
        progressBar.value = progressPercentage;
      }

      const newThumbnailUrl = newImageUrls[0];
      setFormData(prev => ({
        ...prev,
        image_urls: newImageUrls,
        thumbnail_image_url: newThumbnailUrl,
      }));

      const propertyRef = ref(database, `properties/${id}`);
      await update(propertyRef, {
        image_urls: newImageUrls,
        thumbnail_image_url: newThumbnailUrl,
      });

      Swal.fire('Uploaded!', 'Your images have been uploaded.', 'success');
    } catch (error) {
      console.error('Error uploading images:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to add images. Please try again. Error: ${error.message}`,
        footer: 'If the problem persists, show this message to david.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async index => {
    const url = formData.image_urls[index]; // Get the URL of the image to be removed
    const decodedUrl = decodeURIComponent(url); // Decode URL to handle encoded characters
    // Extract the file name directly from the decoded URL
    const imagePath = decodedUrl.split('/o/')[1].split('?')[0]; // Split at '/o/' and then remove URL parameters

    console.log('Decoded URL:', decodedUrl);
    console.log('Image Name:', imagePath);
    Swal.fire({
      title: 'Are you sure?',
      text: 'This image will be removed!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    }).then(async result => {
      if (result.isConfirmed) {
        const imageRef = storageRef(storage, imagePath);
        try {
          await deleteObject(imageRef); // Use deleteObject to remove the file
          const newImageUrls = formData.image_urls.filter(
            (_, i) => i !== index
          );
          const newThumbnailUrl =
            newImageUrls.length > 0 ? newImageUrls[0] : null; // Update thumbnail to the first image or null if no images left
          setFormData(prevFormData => ({
            ...prevFormData,
            image_urls: newImageUrls,
            thumbnail_image_url: newThumbnailUrl,
          }));
          const propertyRef = ref(database, `properties/${id}`);
          await update(propertyRef, {
            image_urls: newImageUrls,
            thumbnail_image_url: newThumbnailUrl,
          });

          Swal.fire('Removed!', 'The image has been removed.', 'success');
        } catch (error) {
          console.error('Error removing image:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error: ${error.message}`,
            footer: 'If the problem persists, show this message to david.',
          });
        }
      }
    });
  };

  const handleDragEnd = event => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFormData(prevFormData => ({
        ...prevFormData,
        image_urls: arrayMove(prevFormData.image_urls, active.id, over.id),
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const propertyRef = ref(database, `properties/${id}`);
    formData.thumbnail_image_url =
      formData.image_urls.length > 0 ? formData.image_urls[0] : null;
    await update(propertyRef, formData)
      .then(() => {
        console.log('Data updated successfully!');
        setLoading(false);
        // Show SweetAlert success modal with animation
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          willClose: () => {
            navigate(`/properties/${id}`); // Redirect to desired page after saving
          },
        });
      })
      .catch(error => {
        console.error('Error updating data:', error);
        setLoading(false);
        // Show SweetAlert error modal with animation
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to save property. Please try again. Error: ${error.message}`, // Assuming error has a 'message' property
          footer: 'If the problem persists, show this message to david.',
        });
      });
  };

  // TODO: also delete the images from storage
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this property!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      setLoading(true);
      const propertyRef = ref(database, `properties/${id}`);
      const propertySnapshot = await get(propertyRef);

      if (propertySnapshot.exists()) {
        const propertyData = propertySnapshot.val();
        const imagesUrls = propertyData.image_urls || [];

        // Delete images from storage
        await Promise.all(
          imagesUrls.map(async imageUrl => {
            const decodedUrl = decodeURIComponent(imageUrl);
            const imagePath = decodedUrl.split('/o/')[1].split('?')[0];
            const imageRef = storageRef(storage, imagePath);
            try {
              await deleteObject(imageRef);
            } catch (error) {
              console.error('Error deleting image:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error deleting image. Please try again. Error: ${error.message}`, // Assuming error has a 'message' property
                footer: 'If the problem persists, show this message to david.',
              });
            }
          })
        );

        // Delete property from database
        remove(propertyRef)
          .then(() => {
            Swal.fire('Deleted!', 'Your property has been deleted.', 'success');
            navigate('/properties');
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Failed to delete property. Please try again. Error: ${error.message}`, // Assuming error has a 'message' property
              footer: 'If the problem persists, show this message to david.',
            });
            console.error('Error deleting property:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        Swal.fire('Error!', 'Property not found.', 'error');
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>Edit Details</h1>
      <div className={styles.container}>
        <div className={styles.imageGallery}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={formData.image_urls}
              strategy={verticalListSortingStrategy}>
              {formData.image_urls.map((url, index) => (
                <SortableItem
                  key={index}
                  id={index}
                  src={url}
                  onRemove={() => handleRemoveImage(index)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <div className={styles.details}>
          <label htmlFor="address" className={styles.label}>
            Address:
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={styles.input}
          />

          <label htmlFor="description" className={styles.label}>
            Description:
          </label>
          <textarea
            ref={textareaRef}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={styles.textarea}
          />

          <label htmlFor="price" className={styles.label}>
            Price:
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className={styles.input}
          />

          <div>
            <label htmlFor="bedrooms" className={styles.label}>
              Bedrooms:
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              className={styles.input}
            />

            <label htmlFor="bathrooms" className={styles.label}>
              Bathrooms:
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <label htmlFor="currently_available" className={styles.label}>
            Status:
          </label>
          <select
            name="currently_available"
            value={formData.currently_available}
            onChange={handleInputChange}
            className={styles.select}>
            <option value={true}>Available</option>
            <option value={false}>Not Available</option>
          </select>

          <label htmlFor="property_type" className={styles.label}>
            Property Type:
          </label>
          <select
            name="property_type"
            value={formData.property_type}
            onChange={handleInputChange}
            className={styles.select}>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Vacation">Vacation</option>
          </select>

          {formData.property_type === 'Vacation' && (
            <div>
              <label htmlFor="reserve_url" className={styles.label}>
                Reservation URL:
              </label>
              <input
                type="text"
                name="reserve_url"
                value={formData.reserve_url}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          )}

          <label htmlFor="thumbnail_description" className={styles.label}>
            Thumbnail Description:
          </label>
          <textarea
            name="thumbnail_description"
            value={formData.thumbnail_description}
            onChange={handleInputChange}
            className={styles.textarea}></textarea>

          <div>
            <label htmlFor="imageUpload" className={styles.label}>
              Add Image:
            </label>
            <input
              type="file"
              id="imageUpload"
              onChange={handleImageUpload}
              disabled={loading}
              className={styles.input}
              accept="image/*"
              multiple
            />
          </div>

          <div>
            <button
              onClick={handleSave}
              disabled={loading}
              className={styles.button}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className={styles.button}>
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPropertyDetails;
