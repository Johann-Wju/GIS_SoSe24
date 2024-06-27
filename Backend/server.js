const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const hostname = '127.0.0.1';
const port = 3000;

const db = new sqlite3.Database('highscore_list.db');

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/submit-highscore') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const data = JSON.parse(body);
      const { username, highscore } = data;

      db.run('INSERT INTO users (name, highscore) VALUES (?, ?)', [username, highscore], function(err) {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Failed to submit highscore' }));
          return console.error(err.message);
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Highscore submitted successfully' }));
      });
    });
  } else if (req.method === 'GET' && req.url === '/get-highscores') {
    db.all('SELECT name, highscore FROM users ORDER BY highscore DESC LIMIT 10', [], (err, rows) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Failed to fetch highscores' }));
        return console.error(err.message);
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(rows));
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});