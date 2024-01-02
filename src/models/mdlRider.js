module.exports = function mdlRider(opts) {
  const { sequelize, sequelizeCon, mdlCity } = opts;

  const { City } = mdlCity;

  const Rider = sequelizeCon.define("rider", {
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
      allowNull: false,
    },
    address: {
      type: sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: sequelize.STRING,
      allowNull: false,
    },
    image_url: {
      type: sequelize.STRING,
      allowNull: true,
    },
    job_type: {
      type: sequelize.STRING,
      allowNull: false,
    },
    job_start_time: {
      type: sequelize.STRING,
      allowNull: false,
    },
    job_end_time: {
      type: sequelize.STRING,
      allowNull: false,
    },
    off_days: {
      type: sequelize.STRING,
      allowNull: true,
    },
    rider_job_start: {
      type: sequelize.STRING,
      allowNull: true,
    },
    rider_job_end: {
      type: sequelize.STRING,
      allowNull: true,
    },
    active: {
      type: sequelize.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  Rider.belongsTo(City, { foreignKey: "city_id" });

  return { Rider };
};

//   Riders.hasOne(Bike, { foreignKey: 'id_rider', foreignKeyConstraint: true });
