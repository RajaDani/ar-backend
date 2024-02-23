module.exports = function mdlUser(opts) {
  const { sequelize, sequelizeCon, mdlCity } = opts;

  const { City } = mdlCity;

  const User = sequelizeCon.define("customer", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: sequelize.STRING,
      allowNull: true,
    },
    password: {
      type: sequelize.STRING,
      allowNull: false,
    },
    contact: {
      type: sequelize.BIGINT,
      allowNull: true,
    },
    bachat_card_holder: {
      type: sequelize.BOOLEAN,
      defaultValue: false,
    },
    student_card_holder: {
      type: sequelize.BOOLEAN,
      defaultValue: false,
    },
    bachat_card_expiry: {
      type: sequelize.BIGINT,
      allowNull: true,
    },
    student_card_expiry: {
      type: sequelize.BIGINT,
      allowNull: true,
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  User.belongsTo(City, { foreignKey: "city_id" });

  return {
    User,
  };
};
