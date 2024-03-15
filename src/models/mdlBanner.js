module.exports = function mdlArea(opts) {
  const { sequelize, sequelizeCon } = opts;

  const Banner = sequelizeCon.define("banner", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: sequelize.STRING,
      allowNull: true,
    },
    image_url: {
      type: sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
    type: {
      type: sequelize.STRING,
      allowNull: true,
    },
  });

  return {
    Banner,
  };
};
