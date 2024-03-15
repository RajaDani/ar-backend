module.exports = function mdlRiderHistory(opts) {
    const { sequelize, sequelizeCon, mdlRider } = opts;

    const { Rider } = mdlRider;

    const RiderHistory = sequelizeCon.define("rider_history", {
        id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        start_time: {
            type: sequelize.BIGINT,
            allowNull: false,
        },
        end_time: {
            type: sequelize.BIGINT,
            allowNull: true,
        },
    });

    RiderHistory.belongsTo(Rider, { foreignKey: "rider_id" });

    return {
        RiderHistory,
    };
};
