const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Test route to check if backend is up
app.get('/test', (req, res) => {
  res.send('✅ Backend is running!');
});

// Route to get all users from DB
app.get('/users', (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error('❌ Connection pool error:', err);
      return res.status(503).json({ error: 'Database unavailable' });
    }

    connection.query('SELECT * FROM users', (err, results) => {
      connection.release(); // Release connection back to pool

      if (err) {
        console.error('❌ Query error:', err);
        return res.status(500).json({ error: 'Query failed' });
      }

      res.json(results);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
