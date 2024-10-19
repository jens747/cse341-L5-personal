const express = require("express");

// const path = require("path");

// allow external domains to access server
const cors = require("cors");

// import mogoDB module
const mongodb = require("./db/accounts");

// initialize the express app
const app = express();

// tell server to listen on port 8080
const port = process.env.PORT || 8080;
// const envar = require('dotenv').config();

/* Middleware that allows express to read 
   form data and access it at req.body */
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "src")));

// json request are accessible at req.body
app.use(express.json());

// enable cors
app.use(cors());

// Response for the site home page
app.use("/", require("./routes"));                          


mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    // Open port 3000 to test the app in a browser
    app.listen(port, () => {
      console.log(`Web Server is listening at port: ${port}`);
    });
  }
});
