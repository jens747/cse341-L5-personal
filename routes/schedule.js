// Import the express module
const express = require("express");
// Create a new router object
const routes = express.Router();

/* Import the schedule controller module */
const routeSchedules = require("../controllers/schedule");

console.log('routeSchedules:', routeSchedules);
console.log('routeSchedules.getAllRecords:', routeSchedules.getAllRecords);


// Import validator controller module
const { scheduleValidation, noteValidation, idValidation, validate } = require("../controllers/validator");

// Import authentication checker
const ensureAuthentication = require("../middleware/auth");
console.log('ensureAuthentication:', ensureAuthentication);

// Set up a GET request, w/a route to the app root
/**
 * @swagger
 * /schedule:
 *   get:
 *     summary: Get all scheduled appointments
 *     security:
 *       - googleOAuth: ['read']
 *     responses:
 *       200:
 *         description: List all scheduled appointments
 *       401:
 *         description: Unauthorized
 */
routes.get("/", ensureAuthentication, routeSchedules.getAllRecords);

/* Another get request that requires :id parameters 
   as part of the request. */
/**
 * @swagger
 * /schedule/{id}:
 *   get:
 *     summary: Get a specific appointment by ID
 *     security:
 *       - googleOAuth: ['read']
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The appointment ID
 *     responses:
 *       200:
 *         description: Appointment data
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
routes.get("/:id", idValidation(), validate, routeSchedules.getRecordById);

// routes.post("/add", routeSchedules.postRecord);
/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Create a new appointment
 *     security:
 *       - googleOAuth: ['write']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountID:
 *                 type: string
 *               scheduleDate:
 *                 type: string
 *               scheduleTime: 
 *                 type: string
 *               notes: string
 *     responses:
 *       201:
 *         description: Appointment created
 *       401:
 *         description: Unauthorized
 */
routes.post("/", scheduleValidation(), validate, 
   routeSchedules.postRecord);

// routes.put("/put/:id", routeSchedules.putRecord);
/**
 * @swagger
 * /schedule/{id}:
 *   put:
 *     summary: Update an existing appointment
 *     security:
 *       - googleOAuth: ['write']
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountID:
 *                 type: string
 *               scheduleDate:
 *                 type: string
 *               scheduleTime: 
 *                 type: string
 *               notes: string
 *     responses:
 *       200:
 *         description: Appointment updated
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
routes.put("/:id", scheduleValidation(), validate, routeSchedules.putRecord);
// routes.put("/:id", noteValidation(), validate, routeSchedules.putRecord);

// routes.delete("/delete/:id", routeSchedules.deleteRecord);
/**
 * @swagger
 * /schedule/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     security:
 *       - googleOAuth: ['write']
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The appointment ID
 *     responses:
 *       200:
 *         description: Appointment deleted
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
routes.delete("/:id", routeSchedules.deleteRecord);

// Export the routes object to be used by the app elsewhere
module.exports = routes;