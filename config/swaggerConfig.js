const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
// const path = require("path");
const swaggerDocument = require("../swagger.json"); 

const options = {
  definition: swaggerDocument, 
  apis: ["../routes/schedule.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
