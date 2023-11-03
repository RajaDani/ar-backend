module.exports = function mdlUser(opts) {
  const { sequelize, sequelizeCon, mdlUser, mdlRider, mdlCustomerAddress, mdlArea, mdlCoupon } =
    opts;
  const { User } = mdlUser;
  const { Rider } = mdlRider;
  const { CustomerAddress } = mdlCustomerAddress;
  const { Area } = mdlArea;
  const { Coupon } = mdlCoupon;

  const Order = sequelizeCon.define("order", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    total: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    posted_by: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    discount: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    delivery_charges: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    profit: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    other_charges: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    other_discount: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    custom_order: {
      type: sequelize.STRING,
      allowNull: true,
    },
    order_bill_image: {
      type: sequelize.STRING,
      allowNull: true,
    },
    order_note: {
      type: sequelize.STRING,
      allowNull: true,
    },
    progress_status: {
      type: sequelize.STRING,
      defaultValue: "Pending",
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  Order.belongsTo(User, { foreignKey: "customer_id" });
  Order.belongsTo(Rider, { foreignKey: "rider_id" });
  Order.belongsTo(CustomerAddress, { foreignKey: "address_id" });
  Order.belongsTo(Area, { foreignKey: "area_id" });
  Order.belongsTo(Coupon, { foreignKey: "coupon_id" });

  return {
    Order,
  };
};