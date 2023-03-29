const controller = require("../controllers/events.controller");

module.exports = function(app) {
    app.get("/:organisationId/events", controller.findAll);

    app.post("/:organisationId/events", controller.create);

    app.delete("/:organisationId/events/:eventId", controller.delete);

    app.put("/:organisationId/events/:eventId", controller.update);

    app.post("/:organisationId/events/:eventId/users/:userId", controller.addUserEvent);

    app.delete("/:organisationId/events/:eventId/users/:userId", controller.removeUserEvent);
}