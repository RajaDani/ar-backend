module.exports = function mdlRider(opts) {
  const { sequelize, sequelizeCon } = opts;

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
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
  });
  return { Rider };
};

//   Riders.hasOne(Bike, { foreignKey: 'id_rider', foreignKeyConstraint: true });
