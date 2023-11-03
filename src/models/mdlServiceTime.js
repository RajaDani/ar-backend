module.exports = function mdlCity(opts) {
  const { sequelize, sequelizeCon } = opts;

  const ServiceTime = sequelizeCon.define("service_time", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    start_time: {
      type: sequelize.STRING,
      allowNull: false,
    },
    end_time: {
      type: sequelize.STRING,
      allowNull: false,
    },
    availability: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  return { ServiceTime };
};

// Cities.hasOne(Bike, { foreignKey: 'id_city', foreignKeyConstraint: true });
