const controller = require("../controllers/messages.controller");
const authJwt = require("../middlewares/authJwt");

module.exports = function(app) {
    console.log('authJwt.verifyToken :>> ', authJwt.verifyToken);
    app.use("/api/messages", authJwt.verifyToken);

    app.get("/api/messages", controller.findAll);
};