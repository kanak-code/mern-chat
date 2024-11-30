module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const { protect: authVerify } = require('../middlewares/authMiddleware');
  const { accessChat, featchChatDB, createGroupChat, renameGroup, removeFromGroup, addInGroup } = require('../controllers/chatController');

  router.get("/", authVerify, featchChatDB);
  router.post("/", authVerify, accessChat);
  router.post("/create-group", authVerify, createGroupChat);
  router.post("/rename-group", authVerify, renameGroup);
  router.get("/remove-from-group", authVerify, removeFromGroup);
  router.get("/add-in-group", authVerify, addInGroup);


  // Use the router for your app
  app.use("/api/v1/chat", router); // This prefixes all routes with "/api"
};
