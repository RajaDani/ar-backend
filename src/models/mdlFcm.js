module.exports = function mdlFcm(opts) {
  const { sequelize, sequelizeCon } = opts;

  const FCM = sequelizeCon.define("fcm_token", {
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
    role: {
      type: sequelize.STRING,
      allowNull: false,
    },
  });
  return { FCM };
};
