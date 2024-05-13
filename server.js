const express = require('express');
const routes = require('./routes');

const PORT = process.env.PORT || 5000;

const app = express();

// Load routes from routes/index.js
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
