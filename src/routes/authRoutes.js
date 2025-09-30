import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// NOTE: Make sure the path to your User model is correct relative to this file
import User from "../models/User.js"; 

const router = express.Router();

// The environment variable should be set in a .env file for production!
// For development, we use a fallback secret.
const JWT_SECRET = process.env.JWT_SECRET || "a_very_secure_secret_key_12345"; 


router.post("/register", async (req, res) => {
  try {
    // Note: It's good practice to sanitize/validate the input (name, email, password, role)
    const { name, email, password, role } = req.body; 

    // check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, passwordHash, role }); 
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.status(201).json({ message: "User registered successfully", user: userResponse });
  } catch (err) {
    console.error(err);
    // In production, avoid sending the full error object
    res.status(500).json({ error: "Server error during registration" }); 
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" }); // Keep message generic for security

    // check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" }); // Keep message generic

    // create token
    const token = jwt.sign(
      // Keep payload minimal and non-sensitive
      { id: user._id, role: user.role }, 
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Prepare user object to send back (excluding password hash)
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    // Send back the token and user data
    res.json({ message: "Login successful", token, user: userResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
});

export default router;