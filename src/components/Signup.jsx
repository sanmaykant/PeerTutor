import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Signup.css';

const subjects = ['Maths', 'Science', 'History', 'Geography', 'English'];

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/signup', {
        name,
        email,
        password,
        strengths: strengths.join(','),
        weaknesses: weaknesses.join(',')
      });
      navigate('/');
    } catch (err) {
      alert('Signup failed');
    }
  };

  const handleMultiSelect = (e, setter) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setter(selected);
  };

  return (
    <form onSubmit={handleSignup} className="signup-form">
      <h2>Sign Up</h2>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
  
      <label>Strengths:</label>
      <select multiple onChange={(e) => handleMultiSelect(e, setStrengths)}>
        {subjects.map((s) => <option key={s}>{s}</option>)}
      </select>
  
      <label>Weaknesses:</label>
      <select multiple onChange={(e) => handleMultiSelect(e, setWeaknesses)}>
        {subjects.map((s) => <option key={s}>{s}</option>)}
      </select>
  
      <button type="submit">Register</button>
    </form>
  );  
}

export default Signup;
