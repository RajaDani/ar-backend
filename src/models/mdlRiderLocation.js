module.exports = function mdlRider(opts) {
  const { sequelize, sequelizeCon, mdlRider } = opts;

  const { Rider } = mdlRider;

  const RiderLocation = sequelizeCon.define("rider_location", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    lat: {
      type: sequelize.FLOAT,
      allowNull: false,
    },
    lng: {
      type: sequelize.FLOAT,
      allowNull: false,
    },
  });

  RiderLocation.belongsTo(Rider, { foreignKey: "rider_id" });
  return { RiderLocation };
};
