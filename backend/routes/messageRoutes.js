module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const { protect: authVerify } = require('../middlewares/authMiddleware');
  const {sendMessage,getAllMsgById} = require('../controllers/messageController');

  router.post("/send-message", authVerify, sendMessage);
  router.get("/get-all-messages/:id", authVerify, getAllMsgById);



  // Use the router for your app
  app.use("/api/v1/message", router); // This prefixes all routes with "/api"
};
