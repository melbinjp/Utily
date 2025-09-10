const express = require('express');
const expressStaticGzip = require('express-static-gzip');

const app = express();
const port = 8080;

app.use('/', expressStaticGzip('dist', {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
