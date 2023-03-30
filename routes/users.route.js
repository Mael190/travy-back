const controller = require("../controllers/users.controller");

module.exports = function(app) {
    app.get("/:organisationId/users", controller.findAll);

    app.post("/:organisationId/users/:userId/roles/:roleId", controller.addUserRole);

    app.delete("/:organisationId/users/:userId/roles/:roleId", controller.removeUserRole);
};