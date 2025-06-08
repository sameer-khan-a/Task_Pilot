// Import the User model
const User = require('../models/User');

// Controller to get data of the currently authenticated user
exports.getUserData = async (req, res) => {
  try {
    // Retrieve user by primary key using the ID decoded from JWT
    const user = await User.findByPk(req.user.id);

    // If user not found, return a 404 response
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return the authenticated user's email
    res.json({ email: user.email });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ msg: "Server error" });
  }
};

// Controller to get a user's public data by their ID
exports.getUserById = async (req, res) => {
  try {
    // Find user by the ID provided in the route parameters
    const user = await User.findByPk(req.params.id);

    // If user does not exist, return a 404 response
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return limited public user info (e.g., id and email)
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ msg: "Server error" });
  }
};
