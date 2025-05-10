import React, { useState, useContext, useEffect } from "react";
import styles from "./styles/Profile.module.scss";
import { AuthContext } from "../providers/AuthProvider";

function Profile() {
    const { user } = useContext(AuthContext);
    const [editable, setEditable] = useState(false);
      const subjects = ["Operating System", "Computer Architecture", "Database Management", "Software Engineering", "Computer Networks"];

    const [formData, setFormData] = useState({
      username: user.username || "",
      email: user.email || "",
      age: user.age || "",
      gender: user.gender || "",
      university: user.university || "",
      marks: subjects.reduce((acc, subject) => {
        acc[subject] = user?.marks?.[subject] || ""; 
        return acc;
      }, {}),
    });

    const handleFormUpdate = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleMarkChange = (subject, value) => {
        const numValue = parseInt(value);
        console.log(numValue);
        if (value === "" || (!isNaN(numValue) && numValue >= 0 && numValue <= 100)) {
            setFormData(prevState => ({
                ...prevState,
                marks: {
                    ...prevState.marks,
                    [subject]: value
                }
            }));
        }
    };

    const handleEdit = () => {
        console.log("Edit button clicked, editable:", editable);
        setEditable(true);
        console.log("After setEditable, editable:", editable);
    };

    const handleSave = () => {
        setEditable(false);
        const payload = {
            username: formData.username,
            email: formData.email,
            age: formData.age,
            gender: formData.gender,
            university: formData.university,
            marks: formData.marks,
        };
        console.log("Sending Payload:", payload);  
    
        (async () => {
            try {
                const response = await fetch("http://localhost:5000/api/user/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        auth_token: localStorage.getItem("auth_token"),
                    },
                    body: JSON.stringify(payload),
                });
    
                const jsonResponse = await response.json();
                console.log(jsonResponse);
            } catch (e) {
                console.error(e);
            }
        })();
    };
    return (
        <div className={styles.mainContainer}>
            <div className={styles.profileContainer}>
                <h2 className={styles.profileTitle}>My Profile</h2>

                {/* Username */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Username</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleFormUpdate}
                        disabled={!editable}
                    />
                </div>

                {/* Email */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                        className={styles.input}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormUpdate}
                        disabled={!editable}
                    />
                </div>

                {/* Age */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Age</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="age"
                        value={formData.age}
                        onChange={handleFormUpdate}
                        disabled={!editable}
                    />
                </div>

                {/* Gender */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Gender</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={handleFormUpdate}
                        disabled={!editable}
                    />
                </div>

                {/* University */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>University</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleFormUpdate}
                        disabled={!editable}
                    />
                </div>

                {/* Subject Marks */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Subject Marks</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {subjects.map((subject) => (
                            <div key={subject} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <label style={{ minWidth: "150px", color: "#000" }}>{subject}:</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.marks?.[subject] || ""}
                                    onChange={(e) => handleMarkChange(subject, e.target.value)}
                                    disabled={!editable}
                                    style={{
                                        padding: "0.5rem",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        width: "100px",
                                        backgroundColor: editable ? "white" : "#f5f5f5"
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    {editable ? (
                        <button className={styles.saveButton} onClick={handleSave}>Save Profile</button>
                    ) : (
                        <button className={styles.editButton} onClick={handleEdit}>Edit Profile</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
