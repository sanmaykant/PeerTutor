import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import styles from "./styles/Profile.module.scss";
import { AuthContext } from "../providers/AuthProvider";

function Profile() {
  const { user } = useContext(AuthContext);
  const [editable, setEditable] = useState(false);

  const subjects = [
    "Operating System",
    "Computer Architecture",
    "Database Management",
    "Software Engineering",
    "Computer Networks",
  ];

  const [formData, setFormData] = useState({
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => setEditable(true);

  const handleSave = () => {
    setEditable(false);
    const payload = { ...formData };

    fetch("http://localhost:5000/api/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(console.log)
      .catch(console.error);
  };

  return (
    <motion.div
      className={styles.animatedBackground}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            {formData.profileImage ? (
              <img 
                src={formData.profileImage} 
                alt="Profile" 
                className={styles.avatar}
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '3px solid #6366f1'
                }} 
              />
            ) : (
              <div className={styles.avatar} style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                background: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {formData.username ? formData.username.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            {editable && (
              <label className={styles.avatarUpload} style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                background: '#6366f1',
                color: 'white',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s'
              }}>
                +
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
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
              <input
                name={field}
                value={formData[field]}
                onChange={handleFormUpdate}
                disabled={!editable}
                style={{ background: editable ? '#111' : '', color: editable ? '#fff' : '', transition: 'background 0.2s, color 0.2s' }}
              />
            </div>
          ))}

          <div className={styles.marksSection}>
            <h4>Subject Marks</h4>
            {subjects.map((subject) => (
              <div className={styles.markItem} key={subject}>
                <label>{subject}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.marks?.[subject] || ""}
                  onChange={(e) => handleMarkChange(subject, e.target.value)}
                  disabled={!editable}
                  style={{ background: editable ? '#111' : '', color: editable ? '#fff' : '', transition: 'background 0.2s, color 0.2s' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.buttonGroup}>
          {editable ? (
            <button className={styles.saveButton} onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className={styles.editButton} onClick={handleEdit}>
              Edit
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;
