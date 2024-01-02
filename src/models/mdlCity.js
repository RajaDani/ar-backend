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
    whatsapp: {
      type: sequelize.BIGINT,
      allowNull: true,
    },
    email: {
      type: sequelize.STRING,
      allowNull: true,
    },
    delivery_timing_start: {
      type: sequelize.STRING,
      allowNull: true,
    },
    delivery_timing_end: {
      type: sequelize.STRING,
      allowNull: true,
    },
    off_day: {
      type: sequelize.STRING,
      allowNull: true,
    },
    off_condition: {
      type: sequelize.STRING,
      allowNull: true,
    },
    off_start_time: {
      type: sequelize.STRING,
      allowNull: true,
    },
    off_end_time: {
      type: sequelize.STRING,
      allowNull: true,
    },
    delivery_discount: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    store_discount: {
      type: sequelize.INTEGER,
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
