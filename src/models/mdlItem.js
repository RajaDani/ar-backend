const { Sequelize } = require("sequelize");

module.exports = function mdlItem(opts) {
  const { sequelize, sequelizeCon, mdlSubcategory, mdlBusiness, mdlAdmin } =
    opts;
  const { Subcategory } = mdlSubcategory;
  const { Business } = mdlBusiness;
  const { Admin } = mdlAdmin;

  const Item = sequelizeCon.define("item", {
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
    price: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    old_price: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    online_fee: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    service_start_time: {
      type: sequelize.STRING,
      allowNull: true,
    },
    service_end_time: {
      type: sequelize.STRING,
      allowNull: true,
    },
    service_online_start_time: {
      type: sequelize.STRING,
      allowNull: true,
    },
    service_online_end_time: {
      type: sequelize.STRING,
      allowNull: true,
    },
    rating: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    featured: {
      type: sequelize.BOOLEAN,
      defaultValue: false,
    },
    image_url: {
      type: sequelize.STRING,
      allowNull: true,
    },
    item_type: {
      type: sequelize.STRING,
      allowNull: false,
    },
    variation_data: {
      type: sequelize.JSON,
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
    created_by: {
      type: sequelize.STRING,
      allowNull: true,
    },
    updated_by: {
      type: sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  Item.belongsTo(Subcategory, { foreignKey: "subcategory_id" });
  Item.belongsTo(Business, { foreignKey: "business_id" });

  return {
    Item,
  };
};
