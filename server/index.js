const express = require('express');
//  const path = require('path');

const PORT = process.env.PORT || 3004;

const app = express();
app.use(express.static('public'));
app.get('/app.bundle.js', (req, res) => {
  res.sendFile('public/app.bundle.js', { root: '../' });
});
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
