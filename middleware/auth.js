// Function to test whether user has authenticated
function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  // Redirect to login if not authenticated
  res.redirect("/"); 
}

module.exports = { ensureAuthentication };
