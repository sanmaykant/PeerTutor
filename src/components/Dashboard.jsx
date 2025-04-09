import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [matches, setMatches] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/matches/${user.id}`)
      .then(res => setMatches(res.data))
      .catch(() => alert('Error fetching matches'));
  }, [user.id]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Matches</h2>
      {matches.length === 0 ? (
        <p>No matches yet.</p>
      ) : (
        matches.map((m) => (
          <div
            key={m.id}
            style={{
              border: '1px solid gray',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            <p><strong>Name:</strong> {m.name}</p>
            <p><strong>Email:</strong> {m.email}</p>

            <p><strong>They can help you with:</strong></p>
            <ul>
              {m.strengths.map((s, index) => (
                <li key={index}>{s}</li>
              ))}
            </ul>

            <p><strong>You can help them with:</strong></p>
            <ul>
              {m.weaknesses.map((w, index) => (
                <li key={index}>{w}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;