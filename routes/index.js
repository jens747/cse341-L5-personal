// Create a new router object using the express framework
const router = require("express").Router();

// Set up Swagger subroute
router.use("/", require("./swagger"));

/* The use() method mounts middleware or subrouters 
   to handle routes.  */
router.use("/accounts", require("./accounts"));

// Exports router object to be used by the app elsewhere
module.exports = router;