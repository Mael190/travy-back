const controller = require("../controllers/channels.controller");

module.exports = function(app) {
    app.get("/:organisationId/channels", controller.findAll);

    app.post("/:organisationId/channels", controller.create);

    app.delete("/:organisationId/channels/:channelId", controller.delete);

    app.put("/:organisationId/channels/:channelId", controller.update);

    app.get("/:organisationId/:channelId/messages", controller.findChannelMessages);

    app.post("/:organisationId/channels/:channelId/roles/:roleId", controller.addChannelRole);

    app.delete("/:organisationId/channels/:channelId/roles/:roleId", controller.removeChannelRole);
}