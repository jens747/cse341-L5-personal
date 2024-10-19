// Load environment variables from .env file
const dotenv = require("dotenv");
dotenv.config();
// import MongoClient class from MongoDB Node driver
const MongoClient = require("mongodb").MongoClient;
/* variable references the connected MongoDB instance, 
   ensures only one connection to the database is made */
let _db;

/* defines initDb function, it will initialize the connection  
   to the MongoDB database, takes a callback parameter, which 
   is invoked when the connection succeeds or fails */
const initDb = (callback) => {
  // if the database is already connected...
  if (_db) {
    console.log("The database is initialized.");
    // return callback w/null (no error) & the _db connection
    return callback(null, _db);
  }
  /* connects to MongoDB server w/connection string 
     (i.e.: from MongoDB Atlas, shell, compass, etc. */
  MongoClient.connect(process.env.MONGO_URI)
    // if the connection is successful... 
    .then(client => {
      // assign database reference to _db by calling client.db() 
      _db = client.db();
      // invoke callback function, as above (line 15)
      callback(null, _db);
    })
    // captures any errors if connection is unsuccessful
    .catch(err => {
      callback(err);
    });
};

const getDb = () => {
  /* Checks if database is null||undefined, if _db is not 
     initialized, it throws an error. Prevents the app 
     from accessing the database unless it is connected. */
  if (!_db) {
    throw Error("The database is not initialized.");
  }
  return _db;
};

// exports functions to be used in other parts of the app
module.exports = { initDb, getDb };
