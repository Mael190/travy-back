module.exports = (sequelize, Sequelize) => {
    return UserOrga = sequelize.define("user_orga", {
      permission: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
  };