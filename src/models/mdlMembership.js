module.exports = function mdlOrderBills(opts) {
    const { sequelize, sequelizeCon } = opts;

    const Membership = sequelizeCon.define("membership", {
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
        name: {
            type: sequelize.STRING,
            allowNull: false
        },
        description: {
            type: sequelize.STRING,
            allowNull: true
        },
        status: {
            type: sequelize.BOOLEAN,
            defaultValue: true
        }
    });

    return { Membership };
};

