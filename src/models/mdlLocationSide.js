module.exports = function mdlLocationSide(opts) {
    const { sequelize, sequelizeCon } = opts;

    const LocationSide = sequelizeCon.define("location_side", {
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
        status: {
            type: sequelize.BOOLEAN,
            defaultValue: true,
        },
    });

    return { LocationSide };
};

