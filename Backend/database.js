// we need a database tool and use sqlite3
const sqlite3 = require('sqlite3').verbose();

// Connect to the database (or create a new one if it doesn't exist)
const db = new sqlite3.Database('highscore_list.db');

// Create a table
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INT, name TEXT, highscore INT)');

  // Insert some sample data
  const stmt = db.prepare('INSERT INTO users VALUES (?, ?, ?)');
  stmt.run(1, 'John Doe', 20000);
  stmt.run(2, 'Jane Smith', 1000);
  stmt.run(3, 'Horst Hund', 5000);
  stmt.finalize();
});

// Close the database connection
db.close();