module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define("events", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
  
    return Event;
  };