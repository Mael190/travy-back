const controller = require("../controllers/users.controller");

module.exports = function(app) {
    app.get("/:organisationId/users", controller.findAll);
};