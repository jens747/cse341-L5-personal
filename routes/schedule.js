// Import the express module
const express = require("express");
// Create a new router object
const routes = express.Router();

/* Import the schedule controller module */
const routeSchedules = require("../controllers/schedule");

// Import validator controller module
const { scheduleValidation, idValidation, validate } = require("../controllers/validator");

// Set up a GET request, w/a route to the app root
routes.get("/", routeSchedules.getAllRecords);

/* Another get request that requires :id parameters 
   as part of the request. */
routes.get("/:id", idValidation(), validate, routeSchedules.getRecordById);

// routes.post("/add", routeSchedules.postRecord);
routes.post("/", scheduleValidation(), validate, 
   routeSchedules.postRecord);

// routes.put("/put/:id", routeSchedules.putRecord);
routes.put("/:id", scheduleValidation(), validate, routeSchedules.putRecord);

// routes.delete("/delete/:id", routeSchedules.deleteRecord);
routes.delete("/:id", routeSchedules.deleteRecord);

// Export the routes object to be used by the app elsewhere
module.exports = routes;