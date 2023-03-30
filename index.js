const express = require("express");
const cors = require("cors");
const db = require("./models");
const authJwt = require("./middlewares/authJwt");
const roleManagement = require("./middlewares/roleManagement");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authJwt.verifyToken);
app.param('organisationId', roleManagement.verifyOrganisation);
app.listen(4041, () => {
  console.log(`Server is running on port 4041`);
});

db.sequelize.sync({force: true}).then(async () => {
  console.log('Drop and Resync Db');
  await initial();
});

async function initial() {

    const [user,user2, organisation, role, channel, event, role2] = await Promise.all([
      db.User.create({
        id: 'edce462c-4286-45b0-9435-85776657de83',
        firstname: 'Enzo',
        lastname: 'Grosrec',
        email: 'enzo.gouerec@gmail.com',
        password: '$2y$10$AUbpnJmDs1NzF3j158sWv.cdIzjf869Rhk9PAETmrU5bdpTSbgqTq',
        color: '#effe'
      }),
      db.User.create({
        id: '9b3252cb-5b27-4825-94c3-1ad77dc421fd',
        firstname: 'Romiche',
        lastname: 'Cahier',
        email: 'romiche.cahier@gmail.com',
        password: '$2y$10$AUbpnJmDs1NzF3j158sWv.cdIzjf869Rhk9PAETmrU5bdpTSbgqTq',
        color: '#effe'
      }),
      db.Organisation.create({
        id: '94d0356e-0562-4987-8837-ad9719617802',
        name: 'EPSI',
        description: 'Une école d\'informatique'
      }),
      db.Role.create({
        id: '9d795618-7a6d-4897-9706-665500ba5717',
        name: 'Comex',
        organisationId: '94d0356e-0562-4987-8837-ad9719617802'
      }),
      db.Channel.create({
        id: 'fd543a82-556b-4e68-9b42-7755ad417138',
        name: 'Général',
        description: 'Canal pour parler de tout et n\'importe quoi',
        color: '#FFF',
        organisationId: '94d0356e-0562-4987-8837-ad9719617802'
      }),
      db.Event.create({
        id: '2051d17e-3aab-4f6f-aad2-fa8860adaa2c',
        title: 'RDV test',
        description: 'ça test ici',
        startDate: '2023-03-17 15:00:00',
        endDate: '2023-03-17 16:00:00',
        creatorId: 'edce462c-4286-45b0-9435-85776657de83',
        organisationId: '94d0356e-0562-4987-8837-ad9719617802'
      }),
      db.Role.create({
        id: '9d795618-7a6d-4897-9706-665500ba5718',
        name: 'RH',
        organisationId: '94d0356e-0562-4987-8837-ad9719617802'
      }),
      db.Message.create({
        content: 'Premier message ici',
        is_seen: false,
        senderId: 'edce462c-4286-45b0-9435-85776657de83',
        channelId: 'fd543a82-556b-4e68-9b42-7755ad417138',
        organisationId: '94d0356e-0562-4987-8837-ad9719617802'
      }),
      db.Message.create({
        content: 'Un message privé',
        senderId: 'edce462c-4286-45b0-9435-85776657de83',
        recipientId: 'edce462c-4286-45b0-9435-85776657de83',
        organisationId: '94d0356e-0562-4987-8837-ad9719617802'
      }),
      db.Message.create({
        content: 'Un 2e message privé',
        senderId: 'edce462c-4286-45b0-9435-85776657de83',
        recipientId: 'edce462c-4286-45b0-9435-85776657de83',
        organisationId: '94d0356e-0562-4987-8837-ad9719617802'
      })
    ]);
    await user.addOrganisation(organisation, { through: { permission: 'admin' }});
    await user2.addOrganisation(organisation, { through: { permission: 'admin' }});
    await user2.addRole(role);
    await event.addUser(user2);
    await user.addRole(role);
    await user.addRole(role2);
    await channel.addRole(role);
}

require('./routes/auth.route.js')(app);
require('./routes/messages.route.js')(app);
require('./routes/channels.route.js')(app);
require('./routes/events.route.js')(app);
require('./routes/users.route.js')(app);