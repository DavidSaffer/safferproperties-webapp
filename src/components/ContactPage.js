import React from 'react';
import styles from './CSS/Contact.module.css'; // Assuming CSS module is named Contact.module.css

const Contact = () => {
    return (
        <div className={styles.contactContainer}>
            <h1 className={styles.header}>Contact Us</h1>
            <div className={styles.contactBlock}>
                <h2>Lyndsay Saffer</h2>
                <p className={styles.title}>President</p>
                <p>Email: <a href="mailto:safferlyndsay@gmail.com" className={styles.email}>safferlyndsay@gmail.com</a></p>
                <p>Phone: <a href="tel:+17039063082" className={styles.phone}>703-906-3082</a></p>
            </div>
            <div className={styles.contactBlock}>
                <h2>Nancy Saffer</h2>
                <p className={styles.title}>Vice President</p>
                <p>Email: <a href="mailto:nancysaffer@gmail.com" className={styles.email}>nancysaffery@gmail.com</a></p>
            </div>
        </div>
    );
};

export default Contact;
