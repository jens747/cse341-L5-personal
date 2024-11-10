const { OAuth2Client } = require("google-auth-library");
// Load environment variables from .env file
const dotenv = require("dotenv");
dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 

// Import node-fetch module
const fetch = require("node-fetch");

async function ensureAuthToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Auth-Header");
  console.log(authHeader);
  console.log('Request Headers:', req.headers);


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Token is missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // For ID token validation
    // const ticket = await client.verifyIdToken({
    //   idToken: token,
    //   audience: process.env.GOOGLE_CLIENT_ID
    // });
    // const payload = ticket.getPayload(); 

    // Token is valid, attach user info to the request object if needed
    // req.user = payload;

    // Validate the token using Google's token info endpoint
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
    const data = await response.json();

    if (data.error) {
      console.error("Token validation error:", data.error);
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }

    // Token is valid, attach user info if needed
    req.user = data;
    next(); 
  } catch (error) {
    console.error("Token validation failed:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
}

module.exports = ensureAuthToken;