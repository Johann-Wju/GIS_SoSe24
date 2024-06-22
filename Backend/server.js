const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('datenbank_highscore.db');

app.use(bodyParser.json());
app.use(cors());

// Create the users table if it doesn't exist
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, highscore INT)');
});

// Get all highscores
app.get('/highscores', (req, res) => {
  db.all('SELECT name, highscore FROM users ORDER BY highscore DESC LIMIT 10', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ highscores: rows });
  });
});

// Add a new highscore
app.post('/highscores', (req, res) => {
  const { name, highscore } = req.body;
  if (!name || !highscore) {
    res.status(400).json({ error: 'Name and highscore are required' });
    return;
  }
  db.run('INSERT INTO users (name, highscore) VALUES (?, ?)', [name, highscore], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});