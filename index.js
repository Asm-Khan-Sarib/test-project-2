const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Create MySQL connection using .env
const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
