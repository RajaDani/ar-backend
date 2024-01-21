module.exports = function mdlUser(opts) {
  const { sequelize, sequelizeCon } = opts;

  const Admin = sequelizeCon.define("admin", {
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
      allowNull: false,
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
    modules: {
      type: sequelize.STRING,
      allowNull: false,
    },
    admin_type: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    admin_creator_id: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
  });

  return {
    Admin,
  };
};
