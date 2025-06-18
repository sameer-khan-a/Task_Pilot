const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// =========================
// REGISTER NEW USER
// =========================
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if a user with the same email already exists
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Hash the user's password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    user = await User.create({
      email,
      password: hashedPassword
    });

    // Generate JWT token valid for 1 day
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send the token back to the client
    res.json({ token });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).send('Server error');
  }
};

// =========================
// LOGIN USER
// =========================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with provided email exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Generate JWT token upon successful login
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return token to client
    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).send('Server error');
  }
};

// =========================
// GET CURRENT USER DATA
// =========================
exports.getUserData = async (req, res) => {
  try {
    // Find user using ID from JWT (set by auth middleware)
    const user = await User.findByPk(req.user);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Return limited user data (email only)
    res.json({ email: user.email });
  } catch (err) {
    console.error('Get User Data Error:', err);
    res.status(500).json({ msg: "Server error" });
  }
};

// =========================
// RESET PASSWORD
// =========================
exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "Email not found" });

    // Hash new password and update it
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Respond with success message
    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ msg: "Server error" });
  }
};
