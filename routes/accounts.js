// Import the express module
const express = require("express");
// Create a new router object
const routes = express.Router();

/* Import the accounts controller module */
const routeAccounts = require("../controllers/accounts");

// Import validator controller module
const { accountValidation, idValidation, validate } = require("../controllers/validator");

/* Set up a GET request, w/a route to the app root, 
   localhost:8080/contacts, the getAllRecords method 
   handles the logic for responding to this request. */
routes.get("/", routeAccounts.getAllRecords);

/* Another get request that requires :id parameters 
   as part of the request. */
routes.get("/:id", idValidation(), validate, routeAccounts.getRecordById);

// routes.post("/add", routeAccounts.postRecord);
routes.post("/", accountValidation(), validate, 
   routeAccounts.postRecord);

// routes.put("/put/:id", routeAccounts.putRecord);
routes.put("/:id", accountValidation(), validate, routeAccounts.putRecord);

// routes.delete("/delete/:id", routeAccounts.deleteRecord);
routes.delete("/:id", routeAccounts.deleteRecord);

// Export the routes object to be used by the app elsewhere
module.exports = routes;