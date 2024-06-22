// we need a database tool and use sqlite3
const sqlite3 = require('sqlite3').verbose();

// Connect to the database (or create a new one if it doesn't exist)
const db = new sqlite3.Database('datenbank_highscore.db');

// Create a table
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INT, name TEXT, highscore INT)');
});

// Close the database connection
db.close();