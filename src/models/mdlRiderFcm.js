module.exports = function mdlRiderFcm(opts) {
  const { sequelize, sequelizeCon, mdlRider } = opts;
  const { Rider } = mdlRider;
  const Rider_Fcm = sequelizeCon.define("rider_fcm", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    token: {
      type: sequelize.STRING,
      allowNull: false,
    },
  });
  Rider_Fcm.belongsTo(Rider, { foreignKey: "rider_id" });

  return { Rider_Fcm };
};
