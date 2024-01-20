module.exports = function mdlDcPercentage(opts) {
  const { sequelize, sequelizeCon } = opts;

  const DCPercentage = sequelizeCon.define("dc_percentage", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    from: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    to: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    percentage: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
  });

  return {
    DCPercentage,
  };
};
