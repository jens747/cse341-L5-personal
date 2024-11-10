const { OAuth2Client } = require("google-auth-library");
// Load environment variables from .env file
const dotenv = require("dotenv");
dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 

async function ensureAuthToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Auth-Header");
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Token is missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload(); // You can access user info here if needed

    // Token is valid, attach user info to the request object if needed
    req.user = payload;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("Token validation failed:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
}

module.exports = ensureAuthToken;