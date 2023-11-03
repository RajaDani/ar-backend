module.exports = function mdlCity(opts) {
  const { sequelize, mdlBusiness, sequelizeCon } = opts;

  const { Business } = mdlBusiness;
  const City = sequelizeCon.define("city", {
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
    contact: {
      type: sequelize.BIGINT,
      allowNull: true,
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  // City.belongsToMany(Business, { through: "business_cities" });

  return { City };
};
