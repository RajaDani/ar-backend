module.exports = function mdlSubcategory(opts) {
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
    bachat_card_discount: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    student_card_discount: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    discount_all_users: {
      type: sequelize.INTEGER,
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
