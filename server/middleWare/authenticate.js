const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const User = require("../models/user"); // Assuming User model is defined

const authenticate = (req, res, next) => {
    // Get the token from the request headers
    const token = req.cookies.token;
    // Check if the token exists and starts with 'Bearer '
    if (!token ) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Extract the token string (remove 'Bearer ')


    // Verify the token
    jwt.verify(token, SECRET_KEY, async (err, decodedToken) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
              // Invalid token
              return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            } else if (err.name === 'TokenExpiredError') {
              // Token has expired
              return res.status(401).json({ message: 'Unauthorized: Token expired' });
            } else {
              // Other errors
              console.error('Error verifying token:', err);
              return res.status(500).json({ message: 'Internal Server Error' });
            }
          }

      // Check if the token has expired
      if (Date.now() >= decodedToken.exp * 12*60*60*1000) {
        return res.status(401).json({ message: 'Unauthorized: Token expired' });
      }

      // Attach decoded token to request for further use
      req.decodedToken = decodedToken;

      try {
        // Check if the user ID exists in MongoDB
        const userId = decodedToken.userId;
        const user = await User.findById(userId);

        // If user not found, return error
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        req.userId=userId
        req.username=user.username

        // Continue to the next middleware or route handler
        next();
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });
  };


module.exports = authenticate;
