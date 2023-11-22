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
