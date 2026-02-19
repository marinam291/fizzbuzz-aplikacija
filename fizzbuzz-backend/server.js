require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/leaderboard', (req, res) => {
  const sql = 'SELECT name, score, totalTime FROM scores ORDER BY score DESC, totalTime ASC';

  pool.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/api/scores', (req, res) => {
  console.log('--- Primljen zahtjev za spremanje ---');
  console.log('Podaci iz body-ja:', req.body);

  const { name, score, totalTime } = req.body;

  const finalName = name || 'Anonymous';
  const finalScore = parseInt(score, 10) || 0;
  const finalTime = parseInt(totalTime, 10) || 0;

  const sql = 'INSERT INTO scores (name, score, totalTime) VALUES (?, ?, ?)';
  const values = [finalName, finalScore, finalTime];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Greška pri pisanju u bazu:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`✅ Uspješno spremljeno: ${finalName} - Score: ${finalScore}`);
    res.json({ success: true });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${PORT}`);
});