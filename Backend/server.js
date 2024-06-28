const http = require('http'); // Import the http module to create an HTTP server
const sqlite3 = require('sqlite3').verbose(); // Import the sqlite3 module and enable verbose mode for detailed error logging
const hostname = '127.0.0.1'; // Define the hostname (localhost)
const port = 3000; // Define the port to listen on

// Connect to the SQLite database (or create a new one if it doesn't exist)
const db = new sqlite3.Database('highscore_list.db');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set CORS (Cross-Origin Resource Sharing) headers to allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight requests for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  // Handle POST requests to /submit-highscore
  if (req.method === 'POST' && req.url === '/submit-highscore') {
    let body = '';

    // Collect data chunks
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // Process the complete data
    req.on('end', () => {
      const data = JSON.parse(body); // Parse the JSON data
      const { username, highscore } = data;

      // Check if the user already exists in the database
      db.get('SELECT highscore FROM users WHERE name = ?', [username], (err, row) => {
        if (err) {
          res.statusCode = 500; // Internal Server Error
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Failed to check highscore' }));
          return console.error(err.message);
        }

        if (row) {
          // User exists, check if the new highscore is higher
          if (row.highscore < highscore) {
            // Update the highscore if the new one is higher
            db.run('UPDATE users SET highscore = ? WHERE name = ?', [highscore, username], function (err) {
              if (err) {
                res.statusCode = 500; // Internal Server Error
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failed to update highscore' }));
                return console.error(err.message);
              }
              res.statusCode = 200; // OK
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Highscore updated successfully' }));
            });
          } else {
            // Do not update if the new highscore is not higher
            res.statusCode = 200; // OK
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Existing highscore is higher or equal' }));
          }
        } else {
          // Insert a new user with the highscore
          db.run('INSERT INTO users (name, highscore) VALUES (?, ?)', [username, highscore], function (err) {
            if (err) {
              res.statusCode = 500; // Internal Server Error
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Failed to submit highscore' }));
              return console.error(err.message);
            }
            res.statusCode = 200; // OK
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Highscore submitted successfully' }));
          });
        }
      });
    });
  } else if (req.method === 'GET' && req.url === '/get-highscores') {
    // Handle GET requests to /get-highscores
    db.all('SELECT name, highscore FROM users ORDER BY highscore DESC LIMIT 10', [], (err, rows) => {
      if (err) {
        res.statusCode = 500; // Internal Server Error
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failed to fetch highscores' }));
        return console.error(err.message);
      }
      res.statusCode = 200; // OK
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(rows)); // Send the highscores as JSON
    });
  } else {
    // Handle other routes (404 Not Found)
    res.statusCode = 404; // Not Found
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

// Start the server and listen on the specified hostname and port
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});