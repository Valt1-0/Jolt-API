const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2d" });
};

// // Register User
// exports.registerUser = async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const user = await User.create({ username, email, password });

//     res.status(201).json({
//       id: user._id,
//       username: user.username,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Login User
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (user && (await user.matchPassword(password))) {
//       res.status(200).json({
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: "Invalid email or password" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
