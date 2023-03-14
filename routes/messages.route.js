const controller = require("../controllers/messages.controller");
const authJwt = require("../middlewares/authJwt");

module.exports = function(app) {
    app.get("/:organisationId/messages", controller.findAll);
};