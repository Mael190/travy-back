const db = require("../models");
const { QueryTypes, Op } = require('sequelize');

const SQL_AllMessages = `
    SELECT m.* 
    FROM user_roles ur
    JOIN channel_roles cr on cr.roleId = ur.roleId
    JOIN channels c on c.id = cr.channelId
    JOIN messages m on m.channelId = c.id
    WHERE ur.userId = $1 AND c.organisationId = $2
    AND m.createdAt BETWEEN $3 AND $4

    UNION 
    
    SELECT m.*
    FROM messages m
    WHERE m.channelId IS NULL
    AND m.organisationId = '94d0356e-0562-4987-8837-ad9719617802'
    AND (m.senderId = $1 OR m.recipientId = $1)
    AND m.createdAt BETWEEN $3 AND $4
`;

exports.findAll = async (req, res) => {
    const messages = await db.sequelize.query(SQL_AllMessages, {
        bind: [req.userId, req.params.organisationId, req.query.startDate, req.query.endDate],
        type: QueryTypes.SELECT
    });

    const messagesMapped = messages.reduce((acc, message) => {
        const type = message.channelId ? 'channels' : 'privates';
        const index = acc[type].findIndex(channel => channel.id === (message.channelId ?? message.senderId));
            
        if(index !== -1) {
            acc[type][index].messages.push(message);
        }
        else {
            acc[type].push({
                id: message.channelId ?? message.senderId,
                messages: [message]
            });
        }
        return acc;

    },{channels: [], privates: []});
    
    return res.send(messagesMapped); 
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

exports.findUserMessages = async (req, res) => {
    const channelMessages = await db.Message.findAll({
        where: {
            organisationId: req.params.organisationId,
            [Op.or]: [
                { 
                    senderId: req.userId,
                    senderId: req.params.interlocutorId
                    
                },
                { 
                    recipientId: req.params.interlocutorId,
                    recipientId: req.userId
                }
            ]
        }
    });
    return res.send(channelMessages);
}