const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const User = require("../models/user"); // Assuming User model is defined

const checkLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {

      req.userId = null;

      return next();
    }


    jwt.verify(token, SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        req.userId = null;
        return next();
      }

      // Check if the token has expired
      if (decodedToken && Date.now() >= decodedToken.exp * 1000) {
        req.userId = null;

        return next();
      }




        // Check if the user ID exists in MongoDB
        const userId = decodedToken.userId;
        const user = await User.findById(userId);

        // If user not found, return error
        if (!user) {
          req.userId = null;
          return next();
        }

        req.userId = userId;
        return next();


    });
  } catch (error) {
    req.userId = null;
    return next();
  }
};

module.exports = checkLoggedIn;
