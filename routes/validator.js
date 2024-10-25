// Import express module
const express = require("express");
// Set up new router object
const routes = express.Router();

// Import validator controller module
const { accountValidationRules, validate } = require("../controllers/validator");

routes.post("/account", accountValidationRules(), validate, (req, res) => {
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName, 
    email: req.body.email, 
    street: req.body.street, 
    city: req.body.city, 
    state: req.body.state, 
    zip: req.body.zip, 
    phone: req.body.phone
  }).then(user => res.json(user))
});