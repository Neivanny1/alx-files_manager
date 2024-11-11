// swaggerConfig.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Files Manager API',
      version: '1.0.0',
      description: 'API documentation for Files Manager',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Update this with your server's URL if needed
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
