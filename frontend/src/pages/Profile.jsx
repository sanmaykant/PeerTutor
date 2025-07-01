import React, { useState, useEffect, useCallback, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./styles/Profile.module.scss";
import { AuthContext } from "../providers/AuthProvider";
import Cropper from 'react-easy-crop';
import BackButton from '../components/BackButton';
import { updateUser, uploadProfilePhoto } from '../utils/apiControllers';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const subjects = [
    "Operating System",
    "Computer Architecture",
    "Database Management",
    "Software Engineering",
    "Computer Networks",
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        age: user.age || "",
        gender: user.gender || "",
        university: user.university || "",
        profileImage: user.profileImage || "",
        marks: subjects.reduce((acc, subject) => {
          acc[subject] = user?.marks?.[subject] || "";
          return acc;
        }, {}),
      });
    }
  }, [user]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFormUpdate = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMarkChange = (subject, value) => {
    const numValue = parseInt(value);
    if (value === "" || (!isNaN(numValue) && numValue >= 0 && numValue <= 100)) {
      setFormData((prev) => ({
        ...prev,
        marks: { ...prev.marks, [subject]: value },
      }));
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const updatedUser = await updateUser(formData);
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const updatedUser = await uploadProfilePhoto(file);
      setFormData(prev => ({ ...prev, profileImage: updatedUser.profileImage }));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to upload profile photo:', error);
    }
  };

  return (
    <div className={`${styles.profileContainer} ${darkMode ? styles.darkMode : ''}`}>
      <BackButton />
      
      <motion.button
        onClick={() => setDarkMode(!darkMode)}
        className={styles.darkModeToggle}
        whileTap={{ scale: 0.9 }}
      >
        {darkMode ? '☀️' : '🌙'}
      </motion.button>
      
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {formData.username ? formData.username.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            {isEditing && (
              <label className={styles.avatarUpload}>
                +
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>
          <h2 className={styles.username}>{formData.username}</h2>
          <p className={styles.email}>{formData.email}</p>
        </div>

        <div className={styles.infoSection}>
          {["age", "gender", "university"].map((field) => (
            <div className={styles.infoGroup} key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input name={field} value={formData[field]} onChange={handleFormUpdate} disabled={!isEditing} />
            </div>
          ))}
        </div>

        <div className={styles.marksSection}>
          <h4>Subject Marks</h4>
          {subjects.map((subject) => (
            <div className={styles.markItem} key={subject}>
              <label>{subject}</label>
              <input type="number" min="0" max="100" value={formData.marks?.[subject] || ""} onChange={(e) => handleMarkChange(subject, e.target.value)} disabled={!isEditing} />
            </div>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          {isEditing ? (
            <button onClick={handleSave} className={styles.saveButton}>Save</button>
          ) : (
            <button onClick={() => setIsEditing(true)} className={styles.editButton}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
