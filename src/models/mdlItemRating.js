module.exports = function mdlItemRating(opts) {
  const { sequelize, sequelizeCon, mdlUser, mdlItem } = opts;
  const { User } = mdlUser;
  const { Item } = mdlItem;

  const ItemRating = sequelizeCon.define("item_rating", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    message: {
      type: sequelize.STRING,
      allowNull: true,
    },
    value: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  ItemRating.belongsTo(User, { foreignKey: "user_id" });
  ItemRating.belongsTo(Item, { foreignKey: "item_id" });

  return {
    ItemRating,
  };
};
