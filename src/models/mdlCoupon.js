module.exports = function mdlCoupon(opts) {
  const { sequelize, sequelizeCon, mdlAdmin } = opts;
  const { Admin } = mdlAdmin;

  const Coupon = sequelizeCon.define("coupon", {
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
    end_date: {
      type: sequelize.STRING,
      allowNull: false,
    },
    coupon_code: {
      type: sequelize.STRING,
      allowNull: false,
    },
    discount: {
      type: sequelize.BIGINT,
      allowNull: false,
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
    usage: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    max_usage: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
  });

  Coupon.belongsTo(Admin, { foreignKey: "admin_id" });

  return {
    Coupon,
  };
};
