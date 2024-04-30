import React from 'react';
import { motion } from 'framer-motion';
import styles from './CSS/Contact.module.css'; // Assuming CSS module is named Contact.module.css

const Contact = () => {
  // Animation variants for the header
  const headerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5, // Duration of the animation
        delay: 0.2, // Starts after 0.2 seconds
      },
    },
  };

  // Animation variants for the entire container
  const containerVariants = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3, // Start animating children after 0.3 seconds
        staggerChildren: 0.2, // Each child animates 0.2 seconds after the previous one
      },
    },
  };

  // Animation variants for each contact block
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5, // Animation duration
      },
    },
  };

  return (
    <div className={styles.contactContainer}>
      <motion.h1 className={styles.header} variants={headerVariants} initial="hidden" animate="visible">
        Contact Us
      </motion.h1>
      <motion.div
        className={styles.contactContainer} // Apply the container animation to the main container
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        <motion.div
          className={styles.contactBlock}
          variants={itemVariants} // Apply the item variants for individual items
        >
          <h2>Lyndsay Saffer</h2>
          <p className={styles.title}>President</p>
          <p>
            Email:{' '}
            <a href="mailto:safferlyndsay@gmail.com" className={styles.email}>
              safferlyndsay@gmail.com
            </a>
          </p>
          <p>
            Phone:{' '}
            <a href="tel:+17039063082" className={styles.phone}>
              703-906-3082
            </a>
          </p>
        </motion.div>
        <motion.div
          className={styles.contactBlock}
          variants={itemVariants} // Same item variants applied here
        >
          <h2>Nancy Saffer</h2>
          <p className={styles.title}>Vice President</p>
          <p>
            Email:{' '}
            <a href="mailto:nancysaffer@gmail.com" className={styles.email}>
              nancysaffer@gmail.com
            </a>
          </p>
        </motion.div>
        <motion.div
          className={styles.contactBlock}
          variants={itemVariants} // Same item variants applied here
        >
          <h2>Stephanie Saffer</h2>
          <p className={styles.title}>Property Manager</p>
          <p>
            Email:{' '}
            <a href="mailto:stephaniesaffer@vt.edu" className={styles.email}>
              stephaniesaffer@vt.edu
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
