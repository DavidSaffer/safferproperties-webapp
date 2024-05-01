import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get, update, remove } from 'firebase/database';
import { uploadBytes, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { deleteObject } from 'firebase/storage';
import { storage, database } from '../../index.js';
import styles from './CSS/EditPropertyDetails.module.css';

import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, MouseSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { SortableItem } from '../../components/SortableItemComponent.js';

function EditConstructionDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    description: '',
    thumbnail_description: '',
    image_urls: [],
    bedrooms: '',
    bathrooms: '',
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
    const constructionRef = ref(database, `newConstruction/${id}`);
    get(constructionRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setFormData({
            address: data.address,
            description: data.description,
            thumbnail_description: data.thumbnail_description || '',
            image_urls: data.image_urls || [],
            bedrooms: data.bedrooms || '',
            bathrooms: data.bathrooms || '',
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
          text: `Failed to fetch construction details. Please try again. Error: ${error.message}`, // Assuming error has a 'message' property
          footer: 'If the problem persists, show this message to david.',
        });
      });
  }, [id]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [formData.description]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const timestamp = new Date().getTime();
    const imageCount = formData.image_urls.length;
    const fileName = `image_${timestamp}_${imageCount}.jpg`;
    const newImageRef = storageRef(storage, `newConstruction/${id}/${fileName}`);

    setLoading(true);
    try {
      const snapshot = await uploadBytes(newImageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      if (!downloadURL) {
        throw new Error('Failed to get download URL');
      }

      // Update the local state with the new image URL
      const newImageUrls = [...formData.image_urls, downloadURL];
      const newThumbnailUrl = newImageUrls[0];
      setFormData(prev => ({
        ...prev,
        image_urls: newImageUrls,
        thumbnail_image_url: newThumbnailUrl,
      }));

      // Update the Firebase Realtime Database
      const constructionRef = ref(database, `newConstruction/${id}`);
      await update(constructionRef, {
        image_urls: newImageUrls,
        thumbnail_image_url: newThumbnailUrl,
      });

      Swal.fire('Uploaded!', 'Your image has been uploaded.', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to add image. Please try again. Error: ${error.message}`, // Assuming error has a 'message' property
        footer: 'If the problem persists, show this message to david.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async index => {
    const url = formData.image_urls[index];
    const decodedUrl = decodeURIComponent(url);
    const imagePath = decodedUrl.split('/o/')[1].split('?')[0];

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
          await deleteObject(imageRef);
          const newImageUrls = formData.image_urls.filter((_, i) => i !== index);
          const newThumbnailUrl = newImageUrls.length > 0 ? newImageUrls[0] : null;
          setFormData(prevFormData => ({
            ...prevFormData,
            image_urls: newImageUrls,
            thumbnail_image_url: newThumbnailUrl,
          }));
          const constructionRef = ref(database, `newConstruction/${id}`);
          await update(constructionRef, {
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
    const constructionRef = ref(database, `newConstruction/${id}`);
    formData.thumbnail_image_url = formData.image_urls.length > 0 ? formData.image_urls[0] : null;
    await update(constructionRef, formData)
      .then(() => {
        console.log('Data updated successfully!');
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          willClose: () => {
            navigate(`/new-construction/${id}`);
          },
        });
      })
      .catch(error => {
        console.error('Error updating data:', error);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to save construction. Please try again. Error: ${error.message}`,
          footer: 'If the problem persists, show this message to david.',
        });
      });
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this construction!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      setLoading(true);
      const constructionRef = ref(database, `newConstruction/${id}`);
      const constructionSnapshot = await get(constructionRef);

      if (constructionSnapshot.exists()) {
        const constructionData = constructionSnapshot.val();
        const imagesUrls = constructionData.image_urls || [];

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
                text: `Error deleting image. Please try again. Error: ${error.message}`,
                footer: 'If the problem persists, show this message to david.',
              });
            }
          })
        );

        // Delete construction from database
        remove(constructionRef)
          .then(() => {
            Swal.fire('Deleted!', 'Your construction has been deleted.', 'success');
            navigate('/editconstructions');
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Failed to delete construction. Please try again. Error: ${error.message}`,
              footer: 'If the problem persists, show this message to david.',
            });
            console.error('Error deleting construction:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        Swal.fire('Error!', 'Construction not found.', 'error');
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>Edit Construction Details</h1>
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
          <label htmlFor="address" className={styles.label}>
            Address:
          </label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={styles.input} />

          <label htmlFor="description" className={styles.label}>
            Description:
          </label>
          <textarea ref={textareaRef} name="description" value={formData.description} onChange={handleInputChange} className={styles.textarea} />

          <div>
            <label htmlFor="bedrooms" className={styles.label}>
              Bedrooms:
            </label>
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className={styles.input} />

            <label htmlFor="bathrooms" className={styles.label}>
              Bathrooms:
            </label>
            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className={styles.input} />
          </div>

          <label htmlFor="thumbnail_description" className={styles.label}>
            Thumbnail Description:
          </label>
          <textarea name="thumbnail_description" value={formData.thumbnail_description} onChange={handleInputChange} className={styles.textarea}></textarea>

          <div>
            <label htmlFor="imageUpload" className={styles.label}>
              Add Image:
            </label>
            <input type="file" id="imageUpload" onChange={handleImageUpload} disabled={loading} className={styles.input} accept="image/*" />
          </div>

          <div>
            <button onClick={handleSave} disabled={loading} className={styles.button}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleDelete} disabled={loading} className={styles.button}>
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditConstructionDetails;
