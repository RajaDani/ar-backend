module.exports = function mdlUser(opts) {
  const { sequelize, sequelizeCon } = opts;

  const Category = sequelizeCon.define("category", {
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
  });

  return {
    Category,
  };
};
