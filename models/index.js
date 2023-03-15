const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },
    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Channel = require("./channel.model.js")(sequelize, Sequelize);
db.Event = require("./event.model.js")(sequelize, Sequelize);
db.User = require("./user.model.js")(sequelize, Sequelize);
db.Message = require("./message.model.js")(sequelize, Sequelize);
db.Organisation = require("./organisation.model.js")(sequelize, Sequelize);
db.Todo = require("./todo.model.js")(sequelize, Sequelize);
db.Role = require("./role.model.js")(sequelize, Sequelize);
db.UserOrga = require("./userOrga.model.js")(sequelize, Sequelize);
db.ChannelRole = sequelize.define("channel_role");
db.UserRole = sequelize.define("user_role");


db.User.belongsToMany(db.Organisation, { through: UserOrga });
db.Organisation.belongsToMany(db.User, { through: UserOrga });

db.User.belongsToMany(db.Role, { through: db.UserRole });
db.Role.belongsToMany(db.User, { through: db.UserRole });

db.Channel.belongsToMany(db.Role, { through: db.ChannelRole });
db.Role.belongsToMany(db.Channel, { through: db.ChannelRole });

db.Role.belongsTo(db.Organisation);

db.Channel.hasMany(db.Message, {foreignKey: {name: 'channelId'}});
db.Channel.belongsTo(db.Organisation);

db.Organisation.hasMany(db.Channel);
db.Organisation.hasMany(db.Role);
db.Organisation.hasMany(db.Message);

db.User.hasMany(db.Message, {foreignKey: {name: 'senderId'}});
db.User.hasMany(db.Message, {foreignKey: {name: 'recipientId'}});
db.User.hasMany(db.Event);
db.User.hasMany(db.Todo);

db.Message.belongsTo(db.User, {foreignKey: {name: 'senderId'}});
db.Message.belongsTo(db.User, {foreignKey: {name: 'recipientId'}});
db.Message.belongsTo(db.Channel, {foreignKey: {name: 'channelId'}});
db.Message.belongsTo(db.Organisation, {foreignKey: {name: 'organisationId'}});

db.Todo.belongsTo(db.User);
db.Todo.belongsTo(db.Event);

db.Event.belongsTo(db.User);


module.exports = db;