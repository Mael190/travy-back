const db = require("../models");
const { QueryTypes } = require("sequelize");

const SQL_UsersFromOrganisation = `
SELECT u.id, uo.permission, u.firstname, u.lastname, u.email, u.job, u.avatar, u.color, r.id as "roleId", r.name as "roleName", uo.phoneNumber, uo.startTime, uo.endTime
FROM user_orgas uo 
LEFT JOIN users u ON u.id = uo.userId
LEFT JOIN user_roles ur on ur.userId = u.id 
LEFT JOIN roles r on r.id = ur.roleId 
WHERE uo.organisationId = $1;
`;


exports.findAll = async (req, res) => {
    const users = await db.sequelize.query(SQL_UsersFromOrganisation, {
        bind: [req.params.organisationId],
        type: QueryTypes.SELECT
    });

    const usersGrouped = users.reduce((acc, user) => {
        const iUser = acc.findIndex(u => u.id === user.id);
        const userRole = {
            id: user.roleId,
            name: user.roleName
        };

        if(iUser === -1) {
            delete user.roleId;
            delete user.roleName;
            user.roles = [userRole];
            acc.push(user)
        }
        else {
            acc[iUser].roles.push(userRole);
        }

        return acc;
    }, []);
    res.send(usersGrouped);
};

exports.addUserRole = async (req, res) => {
    try {
        const [role, user] = await Promise.all([
            db.Role.findByPk(req.params.roleId),
            db.User.findByPk(req.params.userId, {
                include: {
                    model: db.Organisation,
                    where: {id: req.params.organisationId}
            }})
        ]);

        if(!role || !user) {
            return res.status(404).send();
        }
        if(role.organisationId !== req.params.organisationId || user.organisations.lenght < 0) {
            return res.status(403).send();
        }
        user.addRole(role);

        res.status(200).send();
    }
    catch {
        res.status(500).send();
    }
}

exports.removeUserRole = async (req, res) => {
    try {
        const [role, user] = await Promise.all([
            db.Role.findByPk(req.params.roleId),
            db.User.findByPk(req.params.userId, {
                include: {
                    model: db.Organisation,
                    where: {id: req.params.organisationId}
            }})
        ]);

        if(!role || !user) {
            return res.status(404).send();
        }
        if(role.organisationId !== req.params.organisationId || user.organisations.lenght < 0) {
            return res.status(403).send();
        }
        user.removeRole(role);

        res.status(200).send();
    }
    catch {
        res.status(500).send();
    }
}