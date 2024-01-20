module.exports = function mdlOrderBills(opts) {
    const { sequelize, sequelizeCon, mdlRider, mdlBusiness } = opts;

    const { Rider } = mdlRider;
    const { Business } = mdlBusiness;

    const RiderBills = sequelizeCon.define("rider_bills", {
        id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        image: {
            type: sequelize.STRING,
            allowNull: false
        },
        bill_date: {
            type: sequelize.STRING,
            allowNull: false
        },
        total_amount : {
            type: sequelize.INTEGER,
            allowNull: false
        },
        bill_id : {
            type: sequelize.STRING,
            allowNull: true
        },
        status: {
            type: sequelize.BOOLEAN,
            defaultValue: true
        }
    });

    RiderBills.belongsTo(Rider, { foreignKey: "rider_id" });
    RiderBills.belongsTo(Business, { foreignKey: "business_id" });

    return { RiderBills };
};

