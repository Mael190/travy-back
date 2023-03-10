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
    }
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




db.User.belongsToMany(db.Organisation, { through: 'user_orga' });
db.Organisation.belongsToMany(db.User, { through: 'user_orga' });

db.User.belongsToMany(db.Role, { through: 'user_role' });
db.Role.belongsToMany(db.User, { through: 'user_role' });

db.Role.belongsTo(db.Organisation);


db.Channel.hasMany(db.Message);
db.Channel.belongsTo(db.Organisation);

db.Organisation.hasMany(db.Channel);
db.Organisation.hasMany(db.Role);

db.User.hasMany(db.Message, {foreignKey: {name: 'idSender'}});
db.User.hasMany(db.Message, {foreignKey: {name: 'idRecipient'}});
db.User.hasMany(db.Event);
db.User.hasMany(db.Todo);

db.Message.belongsTo(db.User, {foreignKey: {name: 'idSender'}});
db.Message.belongsTo(db.User, {foreignKey: {name: 'idRecipient'}});
db.Message.belongsTo(db.Channel, {foreignKey: {name: 'idChannel'}});

db.Todo.belongsTo(db.User);
db.Todo.belongsTo(db.Event);


module.exports = db;