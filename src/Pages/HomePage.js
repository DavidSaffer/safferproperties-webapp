import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../index.js';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import logo from '../Assets/logo6.png';
import styles from './CSS/HomePage.module.css';
import { motion } from 'framer-motion';

function HomePage() {
  const [featured, setFeatured] = useState([]);

  // keep latest snapshots in refs so either listener can recompute
  const propsRefData = useRef(null);
  const newConstRefData = useRef(null);

  useEffect(() => {
    const propertiesRef = ref(database, 'properties');
    const newConstructionRef = ref(database, 'newConstruction');

    const featuredNames = [
      '3233 4th Street N',
      '409 N Jackson Street',
      '3131 Draper Drive Fairfax, VA ',
    ];

    const normalize = (node, source) => {
      if (!node) return [];
      return Object.entries(node).map(([id, val]) => ({
        id,
        source, // "properties" | "newConstruction"
        ...val,
      }));
    };

    const recompute = () => {
      const list = [
        ...normalize(propsRefData.current, 'properties'),
        ...normalize(newConstRefData.current, 'newConstruction'),
      ];

      // Filter by your featured names (matching on address)
      const featuredItems = list.filter(item =>
        featuredNames.includes(item.address)
      );

      setFeatured(featuredItems);
    };

    const unsubProps = onValue(propertiesRef, snap => {
      propsRefData.current = snap.val() || null;
      recompute();
    });

    const unsubNewConst = onValue(newConstructionRef, snap => {
      newConstRefData.current = snap.val() || null;
      recompute();
    });

    return () => {
      unsubProps();
      unsubNewConst();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.3, duration: 0.5 } },
  };

  return (
    <motion.div
      className={styles.container}
      initial="hidden"
      animate="visible"
      variants={containerVariants}>
      <div className={styles.heroSection}>
        <motion.img
          src={logo}
          alt="Company Logo"
          className={styles.logo}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
        />
        <Link
          to="/properties?filter=available"
          style={{ textDecoration: 'none' }}>
          <button className={styles.ctaButton}>
            Currently Available Properties
          </button>
        </Link>
      </div>

      <div className={styles.featureSection}>
        <h2>Featured Properties</h2>
        <div className={styles.propertiesList}>
          {featured.map((item, idx) => {
            // choose the detail route based on source
            const linkTo =
              item.source === 'newConstruction'
                ? `/new-construction/${item.id}`
                : `/properties/${item.id}`;

            return (
              <motion.li
                key={`${item.source}:${item.id}`}
                className={styles.propertyCard}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: 0.5 + idx * 0.2,
                    type: 'spring',
                    stiffness: 50,
                  },
                }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                <PropertyCard property={item} linkTo={linkTo} />
              </motion.li>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default HomePage;
