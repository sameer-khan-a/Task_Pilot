const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User registration controller
exports.register =  async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user with given email already exists
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with email and hashed password
        user = await User.create({
            email,
            password: hashedPassword
        });

        // Generate JWT token with user id, expires in 1 day
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Return the token to the client
        res.json({ token });
    }
    catch (err) {
        // Handle server errors
        res.status(500).send('Server error');
    }
};

// User login controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // Generate JWT token on successful login
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send token to client
        res.json({ token });
    } catch (err) {
        // Handle server errors
        res.status(500).send('Server error');
    }
};

// Controller to get current authenticated user data
exports.getUserData = async (req, res) => {
    try {
        // Find user by ID from the JWT payload (req.user)
        const user = await User.findByPk(req.user);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        // Send user email only (avoid sending sensitive info)
        res.json({ email: user.email });
    }
    catch (err) {
        // Handle server errors
        res.status(500).json({ msg: "Server error" });
    }
};
