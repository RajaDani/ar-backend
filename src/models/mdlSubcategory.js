module.exports = function mdlUser(opts) {
  const { sequelize, sequelizeCon, mdlCategory } = opts;

  const { Category } = mdlCategory;
  const Subcategory = sequelizeCon.define("subcategory", {
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
      allowNull: false,
    },
    image_url: {
      type: sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    }
  });

  Subcategory.belongsTo(Category, { foreignKey: "category_id" });

  return {
    Subcategory,
  };
};
