const db = require("../models");
const { QueryTypes } = require("sequelize");

exports.create = async (req, res) => {
    try {
        await db.Event.create({
            title: req.body.title,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            creatorId: req.params.userId,
            organisationId: req.params.organisationId
        });
        res.status(201).send();
    }
    catch {
        res.status(500).send();
    }
}

exports.update = async (req, res) => {
    try {
        const updated = await db.Event.update(
        {
            title: req.body.title,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        },
        {
            where: {
                id: req.params.eventId,
                organisationId: req.params.organisationId,
                creatorId: req.userId
            }
        }
        );
        return updated > 0 ? res.status(200).send() :res.status(404).send();
    }
    catch (error){
        console.log('error :>> ', error);
        res.status(500).send();
    }
}

exports.delete = async (req, res) => {
    try {
        const rows = await db.Event.destroy({
            where: {
                id: req.params.eventId,
                organisationId: req.params.organisationId,
                creatorId: req.userId
            }
        });
        return rows > 0 ? res.status(200).send() :res.status(404).send();
    }
    catch (error){
        res.status(500).send(error);
    }
}

const SQL_AllUserEvents = `
(SELECT e.id, e.title, e.description, e.startDate, e.endDate,e.creatorId, ue.userId as "guestId", 1 as "creator"
FROM events e 
LEFT JOIN user_events ue ON ue.eventId = e.id 
WHERE e.creatorId = $1
AND e.organisationId = $2
AND e.startDate > $3 and e.endDate < $4 )

UNION

(SELECT e.id, e.title, e.description, e.startDate, e.endDate,e.creatorId, ue.userId as "guestId", 0 as "creator"
FROM events e
JOIN user_events ue ON ue.eventId = e.id
WHERE ue.userId = $1
AND e.organisationId = $2
AND e.startDate > $3 and e.endDate < $4) `;

exports.findAll = async (req, res) => {
    const events = await db.sequelize.query(SQL_AllUserEvents, {
        bind: [req.userId, req.params.organisationId,req.query.startDate, req.query.endDate],
        type: QueryTypes.SELECT
    });

    const eventsMapped = events.reduce((acc, item) => {
        const iEvent = acc.findIndex(event => event.id === item.id);

        if(iEvent === -1) {
            item.guests = item.guestId ? [item.guestId] : [];
            delete item.guestId;
            acc.push(item);
        }
        else {
            acc[iEvent].guests.push(item.guestId);
        }
        return acc;
    }, [])
    

    return res.send(eventsMapped);
};


exports.addUserEvent = async (req, res) => {
    try {
        const [event, user] = await Promise.all([
            db.Event.findOne({
                where: {
                    id: req.params.eventId,
                    creatorId: req.userId
                }
            }),
            db.User.findByPk(req.params.userId, {
                include: {
                    model: db.Organisation,
                    where: {id: req.params.organisationId}
            }})
        ]);
        if (!event || !user) {
            return res.status(404).send();
        }
        if(event.organisationId !== req.params.organisationId || user.organisations.lenght < 0) {
            return res.status(403).send();
        }

        await event.addUser(user);
        res.status(200).send();
    }
    catch (error){
        res.status(500).send(error);
    }
}
exports.removeUserEvent = async (req, res) => {
    try {
        const [event, user] = await Promise.all([
            db.Event.findOne({
                where: {
                    id: req.params.eventId,
                    creatorId: req.userId
                }
            }),
            db.User.findByPk(req.params.userId, {
                include: {
                    model: db.Organisation,
                    where: {id: req.params.organisationId}
            }})
        ]);
        if (!event || !user) {
            return res.status(404).send();
        }

        if(event.organisationId !== req.params.organisationId || user.organisations.lenght < 0) {
            return res.status(403).send();
        }
        await event.removeUser(user);
        
        return res.status(200).send();
    }
    catch (error){
        res.status(500).send();
    }
}