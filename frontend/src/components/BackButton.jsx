import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import styles from './styles/BackButton.module.scss';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <motion.button
            className={styles.backButton}
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, type: 'spring' }}
            whileHover={{ scale: 1.05, boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)' }}
            whileTap={{ scale: 0.95 }}
        >
            <ArrowLeft size={20} />
            <span>Back</span>
        </motion.button>
    );
};

export default BackButton; 