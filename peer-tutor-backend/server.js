const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.set('db', db);
app.use('/api/users', userRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
