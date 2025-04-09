import React from 'react';
import '../assets/styles/Profile.css';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="profile-container">
      <h2>Welcome, {user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Strengths:</strong> {user.strengths}</p>
      <p><strong>Weaknesses:</strong> {user.weaknesses}</p>
    </div>
  );
}

export default Profile;
