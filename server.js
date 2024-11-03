const express = require("express");

// Set up loggers
const logger = require("./loggers/logger");
const httpLogger = require("./loggers/httpLogger");

// Set up authentication
const session = require("express-session");
// Import Passport.js config file
const passport = require("./config/passport");
// Import authentication routes
const auth = require("./routes/auth");

// allow external domains to access server
const cors = require("cors");

// import mogoDB module
const mongodb = require("./db/accounts");
const catchUncaughtExceptions = require("./middleware/unhandledErrors");

// initialize the express app
const app = express();

// enable loggers
app.use(httpLogger);

// Serve static files (CSS, JavaScript) from "public" directory
app.use(express.static("public"));

// Configure session
app.use(session({
  secret: process.env.AUTH_SESSION_SECRET, 
  resave: false, 
  saveUninitialized: true
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Use authentication routes
app.use(auth);

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

// Catch all uncaught exceptions
catchUncaughtExceptions();


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
