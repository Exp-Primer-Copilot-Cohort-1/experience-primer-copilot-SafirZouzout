// Create web server
// Run node comments.js
// Open browser and go to http://localhost:3000
// Add comments to see them displayed on the page

const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

let comments = [];

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile('comments.html', 'utf8', (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Server error');
          return;
        }

        let commentsHtml = comments.map(comment => {
          return `<div>${comment}</div>`;
        }).join('');

        const html = data.replace('{comments}', commentsHtml);
        res.end(html);
      });
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  } else if (req.method === 'POST') {
    if (req.url === '/add-comment') {
      let body = '';
      req.on('data', data => {
        body += data;
      });

      req.on('end', () => {
        const params = querystring.parse(body);
        comments.push(params.comment);
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
      });
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  } else {
    res.statusCode = 405;
    res.end('Method not allowed');
  }
});

server.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000');
});
