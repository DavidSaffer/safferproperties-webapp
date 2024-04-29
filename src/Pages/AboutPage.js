import React from 'react';
import styles from './CSS/About.module.css'; // Assuming CSS module is named About.module.css

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.header}>About Us</h1>
      <section className={styles.section}>
        <p>
          Saffer Properties, LLC, founded in 2017, is a family-owned and
          operated company serving the Northern Virginia region for over 30
          years. Our managed properties include 16 single-family homes in North
          Arlington, five commercial buildings in Fairfax, and two vacation
          rentals in Corolla, NC.
        </p>
      </section>
      <section className={styles.section}>
        <h2 className={styles.subHeader}>Founder</h2>
        <p>
          Lyndsay Saffer began his career in commercial construction in 1992 and
          spent 26 years helping build one of the area’s largest fire sprinkler
          contracting companies. Now, in the second act of his professional
          career, he is fully dedicated to property management.
        </p>
      </section>
      <section className={styles.section}>
        <h2 className={styles.subHeader}>Services Provided</h2>
        <div className={styles.serviceSection}>
          <h3>Residential Leasing</h3>
          <ul className={styles.list}>
            <p>
              3 to 5 bedroom homes in North Arlington, including ramblers,
              colonials, and expanded bungalows with tiki bars.
            </p>
          </ul>
        </div>
        <div className={styles.serviceSection}>
          <h3>Commercial Leasing</h3>
          <ul className={styles.list}>
            <li>3131 Draper Drive, Fairfax, VA - 16,000 sq ft, zoned I-5</li>
            <li>3159 Draper Drive, Fairfax, VA - 22,000 sq ft, zoned I-2</li>
            <li>3171 Spring Street, Fairfax, VA - 14,000 sq ft, zoned I-2</li>
            <li>2811 Old Lee Hwy, Fairfax, VA - 16,000 sq ft, zoned I-5</li>
            <li>8086 Alban Road, Springfield, VA - 7,000 sq ft, zoned I-5</li>
          </ul>
        </div>
        <div className={styles.serviceSection}>
          <h3>Vacation Rentals</h3>
          <ul className={styles.list}>
            <p>
              Semi-oceanfront and oceanside rentals in Corolla, NC, in
              partnership with Twiddy & CO.
            </p>
          </ul>
        </div>
        <div className={styles.serviceSection}>
          <h3>Real Estate Acquisitions</h3>
          <p>
            Saffer Properties is always looking for new opportunities; we buy
            properties as-is and can close very quickly. If you or someone you
            know is considering selling, please contact us. No fees, no
            commissions, as-is.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
