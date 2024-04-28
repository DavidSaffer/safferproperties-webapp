import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import rentalApp from '../Assets/rentalApp.pdf'; // Import the PDF file
import styles from './CSS/RentalApp.module.css'; // Import the CSS module

function RentalApplication() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const address = queryParams.get('address');

  // Construct the link address
  const linkAddress = address ? `properties/${encodeURIComponent(address.replace(/\s+/g, '-'))}` : '';

  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>How to Apply</h1>
      <p className={styles.instructions}>
        To apply for {address ? `the property located at ${address}` : 'the rental'}, please follow the instructions below:
      </p>
      <ol>
        <li>
          Download the {address ? `application form for ${address}` : 'rental application form'} by clicking{' '}
          <a className={styles.link} href={rentalApp} download>
            here
          </a>
          .
        </li>
        <li>Fill out the application form with accurate information.</li>
        <li>Submit the completed application form to the landlord or property manager.</li>
      </ol>
      <p>If you have any questions, please contact us at example@example.com.</p>
      {address && (
        <button className={styles.returnButton} onClick={() => navigate(-1)}>
          Return to {address}
        </button>
      )}
    </div>
  );
}

export default RentalApplication;
