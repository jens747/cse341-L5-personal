const router = require("express").Router();
// Import the Swagger Express module
const swaggerUi = require("swagger-ui-express");
// Import Swagger JSON module
const swaggerDocument = require("../swagger.json");
const swaggerSpec = require("../config/swaggerConfig");

// Set up Swagger Express API
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;