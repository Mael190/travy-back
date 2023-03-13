const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(4041, () => {
  console.log(`Server is running on port 4041`);
});

db.sequelize.sync({force: true}).then(async () => {
  console.log('Drop and Resync Db');
  await initial();
});

async function initial() {

    const [user, organisation, role, channel] = await Promise.all([
      db.User.create({
        id: 'edce462c-4286-45b0-9435-85776657de83',
        firstname: 'Enzo',
        lastname: 'Grosrec',
        email: 'enzo.gouerec@gmail.com',
        password: '$2y$10$AUbpnJmDs1NzF3j158sWv.cdIzjf869Rhk9PAETmrU5bdpTSbgqTq',
        color: '#effe'
      }),
      db.Organisation.create({
        id: '94d0356e-0562-4987-8837-ad9719617802',
        name: 'EPSI',
        description: 'Une école d\'informatique'
      }),
      db.Role.create({
        name: 'CEO',
        organisationId: '94d0356e-0562-4987-8837-ad9719617802'
      }),
      db.Channel.create({
        id: 'fd543a82-556b-4e68-9b42-7755ad417138',
        name: 'Général',
        description: 'Canal pour parler de tout et n\'importe quoi',
        color: '#FFF',
        organisationId: '94d0356e-0562-4987-8837-ad9719617802'
      }),
      db.Message.create({
        content: 'Premier message ici',
        is_seen: false,
        idSender: 'edce462c-4286-45b0-9435-85776657de83',
        idChannel: 'fd543a82-556b-4e68-9b42-7755ad417138'
      }),
      db.Message.create({
        content: 'Un message privé',
        idSender: 'edce462c-4286-45b0-9435-85776657de83',
        idRecipient: 'edce462c-4286-45b0-9435-85776657de83'
      })
    ]);
    await user.addOrganisation(organisation, { through: { permission: 'admin' }});
    await user.addRole(role);
    await channel.addRole(role);
  }

require('./routes/auth.route.js')(app);
require('./routes/messages.route.js')(app);