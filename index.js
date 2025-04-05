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

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



app.post('/api/shorturl', function(req, res, next){
  const inputUrl = req.body.url;
  if (!inputUrl || !/^https?:\/\//i.test(inputUrl)) return res.json({ error: 'invalid url' });
  const hostname = url.parse(inputUrl).hostname;

  dns.lookup(hostname, (err, address) => {
    if (err) {
      res.json({"error": 'invalid url'});
    } else {
      next();
    }
  });
}, function(req, res) {
  res.json({
    "original_url": req.body.url,
    "short_url": 1
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
