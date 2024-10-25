const mongoose = require("mongoose");

// Define the schema for the "accounts" collection
// const accountSchema = new mongoose.Schema({
const Account = mongoose.model("Account", {
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  street: { type: String }, 
  city: { type: String }, 
  state: { type: String }, 
  zip: { type: String }, 
  phone: { type: String }
});

// Create the model based on the schema
// const Account = mongoose.model("Account", accountSchema);

module.exports = Account;