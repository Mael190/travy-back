const db = require("../models");
const config = require("../config/auth.config");
const { QueryTypes } = require('sequelize');

const sqlFindAll = `
SELECT m.* 
	FROM user_roles ur
    JOIN channel_roles cr on cr.roleId = ur.roleId
    JOIN channels c on c.id = cr.channelId
    JOIN messages m on m.idChannel = c.id
    WHERE ur.userId = $1
    
 UNION 
SELECT m.*
    FROM messages m
    WHERE m.idChannel IS NULL
    AND (m.idSender = $1 OR m.idRecipient = $1)
`;

const messageFormated = (message) =>  {
    return {
        id: message.id,
        content: message.content,
        image: message.image,
        isSeen: message.isSeen,
        senderId: message.idSender,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
}};

exports.findAll = async (req, res) => {
    const messages = await db.sequelize.query(sqlFindAll, {
        bind: [req.userId],
        type: QueryTypes.SELECT
    });

    const messagesMapped = messages.reduce((acc, message) => {
        const type = message.idChannel ? 'channels' : 'privates';
        const index = acc[type].findIndex(channel => channel.id === (message.idChannel ?? message.idSender));
            
        if(index !== -1) {
            acc[type][index].messages.push(messageFormated(message));
        }
        else {
            acc[type].push({
                id: message.idChannel ?? message.idSender,
                messages: [messageFormated(message)]
            });
        }
        return acc;

    },{channels: [], privates: []});
    
    return res.send(messagesMapped); 
}
