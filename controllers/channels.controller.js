const db = require("../models");

exports.create = async (req, res) => {
    try {
        await db.Channel.create({
            name: req.body.name,
            description: req.body.description,
            color: req.body.color,
            organisationId: req.params.organisationId
        });
        res.status(201).send();
    }
    catch {
        res.satus(500).send();
    }
}

exports.update = async (req, res) => {
    try {
        const n = await db.Channel.update(
        {
            name: req.body.name,
            description: req.body.description,
            color: req.body.color,
        },
        {
            where: {
                id: req.params.channelId,
                organisationId: req.params.organisationId
            }
        }
        );
        console.log('n :>> ', n);
        res.status(200).send();
    }
    catch {
        res.status(500).send();
    }
}

exports.delete = async (req, res) => {
    try {
        await db.Channel.destroy({
            where: {
                id: req.params.channelId,
                organisationId: req.params.organisationId
            }
        });
        res.status(200).send();
    }
    catch {
        res.status(500).send();
    }
}

exports.findAll = async (req, res) => {
    console.log('req.params :>> ', req.params);
    const channels = await db.Channel.findAll({
        where: {
            organisationId: req.params.organisationId
        }
    });
    return res.send(channels);
};

exports.findChannelMessages = async (req, res) => {
    const channelMessages = await db.Message.findAll({
        where: {
            channelId: req.params.channelId,
            organisationId: req.params.organisationId
        }
    });
    return res.send(channelMessages);
}

exports.addChannelRole = async (req, res) => {
    try {
        const [channel, role] = await Promise.all([
            db.Channel.findByPk(req.params.channelId),
            db.Role.findByPk(req.params.roleId)
        ]);
        if (!channel || !role) {
            return res.status(404).send();
        }

        if((channel.organisationId || role.organisationId) !== req.params.organisationId) {
            return res.status(403).send();
        }è

        await channel.addRole(role);
        res.status(200).send();
    }
    catch (error){
        res.status(500).send();
    }
}
exports.removeChannelRole = async (req, res) => {
    try {
        const [channel, role] = await Promise.all([
            db.Channel.findByPk(req.params.channelId),
            db.Role.findByPk(req.params.roleId)
        ]);
        if (!channel || !role) {
            return res.status(404).send();
        }

        if((channel.organisationId || role.organisationId) !== req.params.organisationId) {
            return res.status(403).send();
        }

        await channel.removeRole(role);
        res.status(200).send();
    }
    catch (error){
        res.status(500).send();
    }
}