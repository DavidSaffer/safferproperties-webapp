import React from 'react';
import { motion } from 'framer-motion';
import styles from './CSS/About.module.css'; // Assuming CSS module is named About.module.css

const About = () => {
  // Animation for each section to fade and slide up slightly
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className={styles.aboutContainer}>
      <motion.h1
        className={styles.header}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}>
        About Us
      </motion.h1>
      <div className={styles.aboutContent}>
        <motion.section
          className={styles.section}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          <p>
            Saffer Properties, LLC, founded in 2017, is a family-owned and
            operated company serving the Northern Virginia region for over 30
            years. Our managed properties include 16 single-family homes in
            North Arlington, five commercial buildings in Fairfax, and two
            vacation rentals in Corolla, NC.
          </p>
        </motion.section>
        <motion.section
          className={styles.section}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          <h2 className={styles.subHeader}>Founder</h2>
          <p>
            Lyndsay Saffer began his career in commercial construction in 1992
            and spent 26 years helping build one of the area’s largest fire
            sprinkler contracting companies. Now, in the second act of his
            professional career, he is fully dedicated to property management.
          </p>
        </motion.section>
        <motion.section
          className={styles.section}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          <h2 className={styles.subHeader}>Services Provided</h2>
          <div className={styles.serviceSection}>
            <h4>Residential Leasing</h4>
            <p>
              3 to 5 bedroom homes in North Arlington, featuring diverse
              architectural styles such as ramblers, colonials, and expanded
              bungalows with unique amenities like tiki bars.
            </p>
          </div>
          <div className={styles.serviceSection}>
            <h4>Commercial Leasing</h4>
            <p>
              Our strategically located commercial properties are designed to
              cater to diverse business needs, featuring modern facilities and
              flexible floor plans.
            </p>
          </div>
          <div className={styles.serviceSection}>
            <h4>Vacation Rentals</h4>
            <p>
              Semi-oceanfront and oceanside rentals in Corolla, NC, in
              partnership with Twiddy & CO.
            </p>
          </div>
          <div className={styles.serviceSection}>
            <h4>Real Estate Acquisitions</h4>
            <p>
              Saffer Properties is always looking for new opportunities; we buy
              properties as-is and can close very quickly. If you or someone you
              know is considering selling, please contact us. No fees, no
              commissions, as-is.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
