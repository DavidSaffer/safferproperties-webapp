import React from 'react';
import { motion } from 'framer-motion';
import styles from './CSS/Blog.module.css'; // Assuming CSS module is named About.module.css
import { FaTwitter, FaFacebook } from 'react-icons/fa';

const BlogPage = () => {
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

  const posts = [
    {
      title: 'First Post',
      date: '2024-05-05',
      content: 'First post content here...',
      image: 'path/to/image1.jpg',
    },
    {
      title: 'Second Post',
      date: '2024-05-06',
      content: 'Second post content here...',
    },
  ];

  return (
    <div className={styles.blogContainer}>
      <motion.h1
        className={styles.header}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}>
        Blog
      </motion.h1>
      <div className={styles.blogContent}>
        <motion.section
          className={styles.section}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          <h2 className={styles.postTitle}>Title</h2>
          <h6 className={styles.postDate}>Date</h6>
          <p>
            lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
            lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
            lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed utlorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed ut lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed ut lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed ut lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed ut lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed ut lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed ut test and
            thats what I thought
          </p>
        </motion.section>
        <motion.section
          className={styles.section}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          <h2 className={styles.postTitle}>Title</h2>
          <h6 className={styles.postDate}>Date</h6>
          <p>
            lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
            lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
            lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed utlorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed ut lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed ut lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed ut lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed ut lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed ut lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed ut test and
            thats what I thought
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default BlogPage;
