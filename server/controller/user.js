const jwt = require('jsonwebtoken');
const config=require('../config')
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user"); // Assuming User model is defined

const router = express.Router();

// Login route
const logout = async (req, res) => {
  try {
    res.clearCookie('token');

    res.json({ message: "Logout successful" });

    // If login successful, return user data or token
  } catch (error) {
    console.error("Logout failed:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find the user by username
    const user = await User.findOne({ username });

    // If user not found or password doesn't match, return error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ userId: user._id }, config.SECRET_KEY,{ expiresIn: '12h' }); // You can adjust the expiration time as needed
    res.cookie('token', token, { maxAge: 12 * 60 * 60 * 1000, httpOnly: true });

    res.json({ message: "Login successful"});

    // If login successful, return user data or token
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

// Register route
const register = async (req, res) => {
    try {
      const { username, password,fullName } = req.body;
      // // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        let username=existingUser.username

        return res.status(409).json({ message: "Username already exists" ,username});
      }


      const newUser = await User.create({ username, password: password,name:fullName });

      const token = jwt.sign({ userId: newUser._id }, config.SECRET_KEY,{ expiresIn: '12h' });
      res.cookie('token', token, { maxAge: 12 * 60 * 60 * 1000, httpOnly: true });





      //   // Return the newly created user and login successful response
        res.status(201).json({ message: "Registration successful"});

      // // Return the newly created user
    } catch (error) {
      console.error("Registration failed:", error);
      res.status(500).json({ message: "An error occurred during registration" });
    }
  };


// Add routes to the router
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);



module.exports = router;
