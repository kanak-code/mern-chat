const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
  let token;

  try {
    // Check if authorization header exists and starts with 'Bearer'
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Get token from the Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token and decode it to get the user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and exclude password field
      req.user = await User.findById(decoded.id).select("-password");

      // If no user is found, return an error
      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      // Move to the next middleware if user is found
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (error) {
    // Handle any errors that occur during token verification or user retrieval
    res.status(401);
    res.json({
      message: error.message || "Not authorized, token failed",
    });
  }
};

module.exports = { protect };
