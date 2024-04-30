import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import rentalApp from '../Assets/rentalAppForm.pdf';
import styles from './CSS/RentalApp.module.css';

function RentalApplication() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const address = queryParams.get('address');
  const navigate = useNavigate();

  const headerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div className={styles.container} initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 className={styles.title} variants={headerVariants}>
        How to Apply
      </motion.h1>
      <motion.div className={styles.textBlock}>
        <motion.p className={styles.instructions} variants={itemVariants}>
          To apply for {address ? `the property at ${address}` : 'a rental'}, please follow the instructions below:
        </motion.p>
        <motion.ol>
          <motion.li variants={itemVariants}>
            Download the {address ? `application form for ${address}` : 'rental application form'} by clicking{' '}
            <a className={styles.link} href={rentalApp} download>
              here
            </a>
            .
          </motion.li>
          <motion.li variants={itemVariants}>Fill out the application form with accurate information.</motion.li>
          <motion.li variants={itemVariants}>Submit the completed form to the landlord or property manager.</motion.li>
        </motion.ol>
        {address && (
          <motion.button className={styles.returnButton} onClick={() => navigate(-1)} variants={itemVariants}>
            Return to {address}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default RentalApplication;
