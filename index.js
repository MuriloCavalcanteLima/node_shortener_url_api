require('dotenv').config();
const express = require('express');
const cors = require('cors');
const req = require('express/lib/request');
const app = express();
const dns = require('dns');
const url = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Simple in-memory storage
let urls = [];

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// POST: encurta URL
app.post('/api/shorturl', function (req, res) {
  const inputUrl = req.body.url;

  if (!inputUrl || !/^https?:\/\//i.test(inputUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const hostname = url.parse(inputUrl).hostname;

  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    } else {
      const id = urls.length + 1;
      urls.push(inputUrl);
      return res.json({
        original_url: inputUrl,
        short_url: id
      });
    }
  });
});

// GET: redireciona
app.get('/api/shorturl/:id', function (req, res) {
  const id = parseInt(req.params.id);
  const originalUrl = urls[id - 1];

  if (!originalUrl) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
