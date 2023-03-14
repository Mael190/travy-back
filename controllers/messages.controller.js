const db = require("../models");
const { QueryTypes } = require('sequelize');

const messageFormated = (message) =>  {
    return {
        id: message.id,
        content: message.content,
        image: message.image,
        isSeen: message.is_seen,
        senderId: message.senderId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
}};

const sqlFindAll = `
    SELECT m.* 
    FROM user_roles ur
    JOIN channel_roles cr on cr.roleId = ur.roleId
    JOIN channels c on c.id = cr.channelId
    JOIN messages m on m.channelId = c.id
    WHERE ur.userId = $1 AND c.organisationId = $2

UNION 
    SELECT m.*
    FROM messages m
    JOIN users u1
    WHERE m.channelId IS NULL
    AND m.organisationId = '94d0356e-0562-4987-8837-ad9719617802'
    AND (m.senderId = $1 OR m.recipientId = $1)
`;

exports.findAll = async (req, res) => {
    const messages = await db.sequelize.query(sqlFindAll, {
        bind: [req.userId, req.params.organisationId],
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