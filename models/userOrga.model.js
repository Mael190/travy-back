module.exports = (sequelize, Sequelize) => {
    return UserOrga = sequelize.define("user_orga", {
      permission: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING(12),
        allowNull: true
      },
      startTime: {
        type: Sequelize.STRING(5),
        allowNull: true
      },
      endTime: {
        type: Sequelize.STRING(5),
        allowNull: true
      }
    });
  };