module.exports = function mdlUser(opts) {
  const { sequelize, sequelizeCon, mdlOrder, mdlItem, mdlBusiness } = opts;
  const { Order } = mdlOrder;
  const { Item } = mdlItem;
  const { Business } = mdlBusiness;

  const OrderItem = sequelizeCon.define("order_item", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    order_item_quantity: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    order_item_price: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    order_item_name: {
      type: sequelize.STRING,
      allowNull: true,
    },
    order_item_profit: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['order_id', 'item_id']
      }
    ]
  });
  OrderItem.belongsTo(Order, { foreignKey: "order_id" });
  OrderItem.belongsTo(Item, { foreignKey: "item_id" });
  OrderItem.belongsTo(Business, { foreignKey: "business_id" });
  Order.hasMany(OrderItem, { foreignKey: 'order_id' });

  return {
    OrderItem,
  };
};
