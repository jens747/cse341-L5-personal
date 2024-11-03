const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const ensureAuthentication = require("../middleware/auth");
// Import the path module
const path = require("path");

router.get("/auth/google", authController.googleLogin);
router.get("/auth/google/callback", authController.googleCallback);
router.get("/logout", authController.logout);

// Serve the dashboard page only if the user is authenticated
router.get("/dashboard", ensureAuthentication, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/dashboard.html"));
});

module.exports = router;