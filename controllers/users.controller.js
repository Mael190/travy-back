const db = require("../models");
const { QueryTypes } = require("sequelize");

const SQL_UsersFromOrganisation = `
SELECT u.id, uo.permission, u.firstname, u.lastname, u.email, u.password, u.avatar, u.color, r.id as "roleId", r.name as "roleName" FROM user_orgas uo 
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