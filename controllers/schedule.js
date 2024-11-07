const mongodb = require("../db/accounts");
const ObjectId = require("mongodb").ObjectId;

// Error Handling
const Api404Error = require("../middleware/api404Error");
const httpStatusCodes = require("../middleware/httpStatusCodes");

const getAllRecords = async (req, res, next) => {
  try {
    // get the MongoDB database instance
    const db = mongodb.getDb();

    // Query db to get all documents in "schedule"
    const result = await db.collection("schedule").find();

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

  // Test the ID to see if it is a valid MongoDB ObjectID
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid MongoDB ID" });
  }
    
  try {
    /* Get reference to the connected MongoDB database 
       instance so it can be queried */
    const db = mongodb.getDb();
    
    // Access the schedule collection within the database
    const result = await db
      .collection("schedule")
      .findOne({ _id: userId });

    if (!result) {
      return res.status(404).json({ error: "Search failed. No records available. "});
    }

    // Query Contacts for a record with a matching id
    // const id = await result.find({ _id: userId });

    /* MongoDB returns a cursor, which is an iterator. 
       This converts the cursor returned by find() into 
       a data array  */
    // const data = await result.toArray();

    // Indicates that the response will be in JSON
    res.setHeader("Content-Type", "application/json");
    /* Sends successful HTTP status code (200), selects 
       the first document in the array */
    res.status(200).json(result);
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
    // Add the data from the form into "schedule" collection
    const result = await db.collection("schedule").insertOne(formData);
      
    // Return the id of the schedule collection record
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
  // Convert id from string into a MongoDB ObjectId
  const userId = req.params.id;

  // Test the ID to see if it is a valid MongoDB ObjectID
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid MongoDB ID" });
  }

  try {
    // Reference the connected MongoDB database
    const db = mongodb.getDb();

    // schedule object values are updated by req.body
    const appointment = {
      accountID: req.body.accountID, 
      scheduleDate: req.body.scheduleDate, 
      scheduleTime: req.body.scheduleTime, 
      notes: req.body.notes
    }
    
    // Access the schedule collection within the database
    const collection = db.collection("schedule");

    const record = await collection.findOne({ _id: new ObjectId(userId) });

    if (!record) {
      // return res.status(404).json({ error: "No records available to update. "});
      throw new Api404Error("Not found", httpStatusCodes.NOT_FOUND, `User with id: ${req.params.id} not found.`);
    }
      
    /* Replace data in selected _id with data in contacts 
       object, returns result.modifiedCount status */
    const result = await collection.replaceOne({ _id: new ObjectId(userId) }, appointment);

    // Source: https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/
    // Update the notes field
    // const result = await collection.updateOne(
    //   {
    //     _id: new ObjectId(userId)
    //   }, 
    //   // Use updateOne with $set operator to update notes only
    //   {
    //     $set: {
    //       notes: req.body.notes
    //     }
    //   }
    // );
    
    // modifiedCount checks to see if document was modified
    if (result.modifiedCount > 0) {
      res.status(204).json({ message: "Record updated successfully: ", id: result.insertId });;
    } else {
      // Sends HTTP 500 (Internal Server Error), if error 
      res.status(500).json({err: "An error occurred while updating record."});
    }
  } catch (err) {
    // Handle the specific Api404Error and other errors
    if (err instanceof Api404Error) {
      return res.status(404).json({ error: err.message });
    } else {
      // Sends HTTP 500 (Internal Server Error), if error 
      res.status(500).json({err: "Internal Server Error."});
    }
  }
}

const deleteRecord = async (req, res, next) => {
  // Convert the id from the URL into a Mongo ObjectId
  const id = req.params.id;

  // Run a check to see if the ID is valid
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Please use a valid ID" });
  }

  try {
    /* Get reference to the connectd MongoDB database 
      instance so it can be queried */
    const db = mongodb.getDb();
    // Access the schedule collection within the database
    const result = await db
      .collection("schedule")
      .deleteOne({ _id: new ObjectId(id) });

    // Check to see if account was deleted
    if (result.deletedCount > 0) {
      // Success response
      res.status(200).json({ message: "Record deleted successfully." });
    } else {
      throw new Api404Error("Not found", httpStatusCodes.NOT_FOUND, "Record not found.");
    }
  } catch (error) {
    // console.error("Error deleting record:", error);
    if (error instanceof Api404Error) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ message: "Failed to delete record", error });
    }
  }
};

// Exports both functions to be used in other parts of app
module.exports = { getAllRecords, getRecordById, postRecord, putRecord, deleteRecord };