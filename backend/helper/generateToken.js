const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d", // Token expires in 30 days
    });
  } catch (error) {
    console.error("Error generating JWT:", error.message);
    return null;
  }
};

module.exports = generateToken;
