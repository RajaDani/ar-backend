module.exports = function mdlRiderReview(opts) {
    const { sequelize, sequelizeCon, mdlRider, mdlUser, mdlOrder } = opts;

    const { Rider } = mdlRider;
    const { User } = mdlUser;
    const { Order } = mdlOrder;

    const RiderReview = sequelizeCon.define("rider_review", {
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

    RiderReview.belongsTo(Rider, { foreignKey: "rider_id" });
    RiderReview.belongsTo(User, { foreignKey: "customer_id" });
    RiderReview.belongsTo(Order, { foreignKey: "order_id" });

    return { RiderReview };
};

