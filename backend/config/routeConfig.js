module.exports = (app) => {
require("../routes/userRoutes.js")(app)
require("../routes/chatRoutes.js")(app)
require("../routes/messageRoutes.js")(app)
}