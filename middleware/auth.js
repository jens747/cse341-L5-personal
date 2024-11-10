// Function to test whether user has authenticated
function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
  }
  // Redirect to login if not authenticated
  // res.redirect("/"); 
  // Return a 401 Unauthorized error if not authenticated
  res.status(401).json({ message: "Unauthorized: You must log in to access this resource." });
}

module.exports = ensureAuthentication;
