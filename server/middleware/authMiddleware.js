// Import the JSON Web Token library
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and protect private routes
const authMiddleware = (req, res, next) => {
  // Extract the token from the Authorization header (format: "Bearer <token>")
  const token = req.header('authorization')?.replace('Bearer ', '');

  // If no token is provided, deny access
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization needed !!!" });
  }

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, deny access
    return res.status(401).json({ msg: "Token not valid" });
  }
};

// Export the middleware to be used in route protection
module.exports = authMiddleware;
