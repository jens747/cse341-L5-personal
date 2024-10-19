const router = require("express").Router();
// Import the Swagger Express module
const swaggerUi = require("swagger-ui-express");
// Import Swagger JSON module
const swaggerDocument = require("../swagger.json");

// Set up Swagger Express API
router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

module.exports = router;