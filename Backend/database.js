const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('highscore_list.db');

db.serialize(() => {
  // Create a table with auto-generated unique IDs
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, highscore INT)', (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Users table created or already exists.');
  });

  // Insert some sample data without specifying the ID
  const stmt = db.prepare('INSERT INTO users (name, highscore) VALUES (?, ?)', (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
  });

  stmt.run('John Doe', 20000);
  stmt.run('Jane Smith', 1000);
  stmt.run('Horst Hund', 5000);
  stmt.finalize((err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Sample data inserted.');
  });

  // Query and print out the data
  db.each('SELECT id, name, highscore FROM users', (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(`ID: ${row.id}, Name: ${row.name}, Highscore: ${row.highscore}`);
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Database connection closed.');
});