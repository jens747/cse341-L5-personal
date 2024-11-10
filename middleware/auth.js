// Function to test whether user has authenticated
// const ensureAuthentication = (req, res, next) => {
//   if (req.isAuthenticated && req.isAuthenticated()) {
//       return next();
//   }
  // Redirect to login if not authenticated
  // res.redirect("/"); 
  // Return a 401 Unauthorized error if not authenticated
//   res.status(401).json({ message: "Unauthorized: You must log in to access this resource." });
// }

const ensureAuthentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(`Auth-Header: ${authHeader}`);

  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return res.status(401).json({ message: "Unauthorized: Missing or invalid token." });
  // }

  // const token = authHeader.split(' ')[1];

  // Verify the token
  // This can be done using libraries such as `google-auth-library` to validate the token
  // validateGoogleToken(token)
  //   .then(user => {
  //     // Token is valid, attach user info to req object
  //     req.user = user;
  //     next();
  //   })
  //   .catch(err => {
  //     console.error('Token validation failed:', err);
  //     res.status(401).json({ message: "Unauthorized: Invalid token." });
  //   });
}

module.exports = ensureAuthentication;
