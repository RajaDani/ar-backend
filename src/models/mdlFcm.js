module.exports = function mdlFcm(opts) {
  const { sequelize, sequelizeCon, mdlUser, mdlAdmin } = opts;
  const { User } = mdlUser;
  const { Admin } = mdlAdmin;

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
  FCM.belongsTo(User, { foreignKey: "user_id" });
  FCM.belongsTo(Admin, { foreignKey: "Admin_id" });

  return { FCM };
};
