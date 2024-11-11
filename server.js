const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { swaggerUi, swaggerDocs } = require('./swaggerConfig');

const app = express();

// Parse JSON bodies
app.use(bodyParser.json());
// load docs
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Load routes from routes/index.js
app.use('/', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
