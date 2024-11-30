module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const {protect:authVerify} = require('../middlewares/authMiddleware');

    const {register,login,allUsers} = require('../controllers/userController');
  
    router.post("/sign-in", login);
    router.post("/sign-up", register);
    router.get("/getUser",authVerify, allUsers);
  
  
    // Use the router for your app
    app.use("/api/v1/user", router); // This prefixes all routes with "/api"
  };
  