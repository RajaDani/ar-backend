module.exports = function mdlBusinessReview(opts) {
  const { sequelize, sequelizeCon, mdlBusiness, mdlUser } = opts;

  const { Business } = mdlBusiness;
  const { User } = mdlUser;

  const BusinessReview = sequelizeCon.define("business_review", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: sequelize.STRING,
      allowNull: false,
    },
    rating: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
  });

  BusinessReview.belongsTo(Business, { foreignKey: "business_id" });
  BusinessReview.belongsTo(User, { foreignKey: "customer_id" });

  return { BusinessReview };
};
