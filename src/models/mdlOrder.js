module.exports = function mdlOrder(opts) {
  const { sequelize, sequelizeCon, mdlUser, mdlRider, mdlCustomerAddress, mdlArea, mdlCoupon, mdlCity } =
    opts;
  const { User } = mdlUser;
  const { Rider } = mdlRider;
  const { CustomerAddress } = mdlCustomerAddress;
  const { Area } = mdlArea;
  const { Coupon } = mdlCoupon;
  const { City } = mdlCity;

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
    address: {
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
    order_processing_time: {
      type: sequelize.BIGINT,
      allowNull: true,
    },
    order_deliver_time: {
      type: sequelize.BIGINT,
      allowNull: true,
    },
    rider_accepted_order: {
      type: sequelize.BOOLEAN,
      defaultValue: false,
    },
    accepted_order_at: {
      type: sequelize.STRING,
      allowNull: true,
    },
    delivery_time: {
      type: sequelize.STRING,
      defaultValue: "30-40 min",
    },
    admin_edited: {
      type: sequelize.BOOLEAN,
      defaultValue: false,
    },
    hold_order_till: {
      type: sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  Order.belongsTo(User, { foreignKey: "customer_id" });
  Order.belongsTo(Rider, { foreignKey: "rider_id" });
  Order.belongsTo(Area, { foreignKey: "area_id" });
  Order.belongsTo(Coupon, { foreignKey: "coupon_id" });
  Order.belongsTo(City, { foreignKey: "city_id" });

  return {
    Order,
  };
};
