import React, { useState, useContext } from "react";
import styles from "./Profile.module.scss";
import { AuthContext } from "../providers/AuthProvider";

function Profile() {
    const { user } = useContext(AuthContext);
    const [editable, setEditable] = useState(false);
    const [formData, setFormData] = useState({
        username: user.username || "",
        email: user.email || "",
        age: user.age || "",
        gender: user.gender || "",
        university: user.university || "",
        strengths: user.strengths || [],
        weaknesses: user.weaknesses || []
    });

    const handleFormUpdate = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleListChange = (e, key) => {
        const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
        setFormData((prev) => ({ ...prev, [key]: selected }));
    };

    const handleSave = () => {
        setEditable(false);
        (async () => {
            try {
                const response = await fetch("http://localhost:5000/api/user/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        auth_token: localStorage.getItem("auth_token"),
                    },
                    body: JSON.stringify({
                        ...formData
                    })
                })

                const jsonResponse = await response.json();
                console.log(jsonResponse);
            } catch (e) {
                console.error(e);
            }
        })();
    };

const subjects = ["Maths", "Science", "History", "Geography", "English"];

return (
    <div className={styles.mainContainer}>
    <div className={styles.profileContainer}>
    <h2 className={styles.profileTitle}>My Profile</h2>

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

    <div className={styles.fieldGroup}>
    <label className={styles.label}>Strengths</label>
    <select
    className={styles.select}
    multiple
    username="strengths"
    value={formData.strengths}
    onChange={(e) => handleListChange(e, "strengths")}
    disabled={!editable}
    >
    {subjects.map((subject) => (
        <option key={subject} value={subject}>{subject}</option>
    ))}
    </select>
    </div>

    <div className={styles.fieldGroup}>
    <label className={styles.label}>Weaknesses</label>
    <select
    className={styles.select}
    multiple
    username="weaknesses"
    value={formData.weaknesses}
    onChange={(e) => handleListChange(e, "weaknesses")}
    disabled={!editable}
    >
    {subjects.map((subject) => (
        <option key={subject} value={subject}>{subject}</option>
    ))}
    </select>
    </div>

    <div className={styles.buttonGroup}>
    {editable ? (
        <button className={styles.saveButton} onClick={handleSave}>Save</button>
    ) : (
        <button className={styles.editButton} onClick={() => setEditable(true)}>Edit</button>
    )}
    </div>
    </div>
    </div>
);
}

export default Profile;
