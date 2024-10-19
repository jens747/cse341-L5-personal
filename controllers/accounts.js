const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllRecords = async (req, res, next) => {
  try {
    // get the MongoDB database instance
    const db = mongodb.getDb();

    // Query db to get all documents in "accounts"
    const result = await db.collection("accounts").find();

    // convert MongoDB cursor (result) into array
    const data = await result.toArray();

    // server responds with JSON
    res.setHeader("Content-Type", "application/json");

    // HTTP successful (200) response
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching data."
    });
  }
};

/* Asynchronous function gets a record from db based on id. 
   req: client's request containing the id of the record, 
   res: HTTP response sent back with the requested record, 
   next: callback to move to the next middleware in chain */
const getRecordById = async (req, res, next) => {
  /* Converts the id from the requesting URL into a MongoDB 
     ObjectId, I.E.: /contacts/:id */
  const userId = new ObjectId(req.params.id);
  try {
    /* Get reference to the connectd MongoDB database 
       instance so it can be queried */
    const db = mongodb.getDb();
    
    // Access the accounts collection within the database
    const result = await db.collection("accounts");
    // Query Contacts for a record with a matching id
    const id = await result.find({ _id: userId });
    /* MongoDB returns a cursor, which is an iterator. 
       This converts the cursor returned by find() into 
       a data array  */
    const data = await id.toArray();
    // console.log("Data: ", data);

    // Indicates that the response will be in JSON
    res.setHeader("Content-Type", "application/json");
    /* Sends successful HTTP status code (200), selects 
       the first document in the array */
    res.status(200).json(data[0]);
  } catch (err) {
    // Sends HTTP 500 (Internal Server Error), if error 
    res.status(500).json({err: "An error occurred while fetching data."});
  }
};

const postRecord = async (req, res, next) => {
  // Access the form data stored in req.body
  const formData = req.body;

  try {
    // get the MongoDB database instance
    const db = mongodb.getDb();
    // Add the data from the form into "accounts" collection
    const result = await db.collection("accounts").insertOne(formData);
      
    // Return the id of the accounts collection record
    console.log('Document inserted with _id: ', result.insertedId);

    // Indicates that the response will be in JSON
    res.setHeader("Content-Type", "application/json");
    /* Sends successful HTTP status code (200), selects 
       the first document in the array */
    res.status(201).json(result);
  } catch (err) {
    // Sends HTTP 500 (Internal Server Error), if error 
    res.status(500).json({err: "Failed to add record.", err});
  }
}

const putRecord = async (req, res, next) => {
  try {
    /* Get reference to the connectd MongoDB database 
      instance so it can be queried */
    const db = mongodb.getDb();
    // Convert id from string into a MongoDB ObjectId
    const userId = new ObjectId(req.params.id);

    // account object values are updated by req.body
    const account = {
      firstName: req.body.firstName, 
      lastName: req.body.lastName, 
      email: req.body.email, 
      street: req.body.street, 
      city: req.body.city, 
      state: req.body.state, 
      zip: req.body.zip, 
      phone: req.body.phone
    }
    
    // Access the accounts collection within the database
    const result = await db
      .collection("accounts")
      /* Replace data in selected _id with data in contacts 
         object, returns result.modifiedCount status */
      .replaceOne({ _id: userId }, account);
    
    // modifiedCount checks to see if document was modified
    if (result.modifiedCount > 0) {
      res.status(204).json({ message: "Record updated successfully: ", id: result.insertId });;
    } else {
      // Sends HTTP 500 (Internal Server Error), if error 
      res.status(500).json({err: "An error occurred while updating record."});
    }
  } catch (err) {
    // Sends HTTP 500 (Internal Server Error), if error 
    res.status(500).json({err: "Internal Server Error."});
  }
}

const deleteRecord = async (req, res, next) => {
  try {
    /* Get reference to the connectd MongoDB database 
       instance so it can be queried */
    const db = mongodb.getDb();
    // Convert the id from the URL into a Mongo ObjectId
    const id = req.params.id;

    // Run a check to see if the ID is valid
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Access the accounts collection within the database
    const result = await db
      .collection("accounts")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      // Success response
      res.status(204).json({ message: "Record deleted successfully" });
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ message: "Failed to delete record", error });
  }
};

// Exports both functions to be used in other parts of app
module.exports = { getAllRecords, getRecordById, postRecord, putRecord, deleteRecord };