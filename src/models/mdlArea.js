module.exports = function mdlArea(opts) {
    const { sequelize, sequelizeCon, mdlCity, mdlLocationSide } = opts;
    const { City } = mdlCity;
    const { LocationSide } = mdlLocationSide;
    const Area = sequelizeCon.define("area", {
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
        delivery_charges: {
            type: sequelize.STRING,
            allowNull: true,
        },
        km_from_city: {
            type: sequelize.INTEGER,
            allowNull: true,
        },
        charges_per_km: {
            type: sequelize.INTEGER,
            allowNull: true,
        },
        road_issue: {
            type: sequelize.BOOLEAN,
            defaultValue: false,
        },
        in_city: {
            type: sequelize.BOOLEAN,
            defaultValue: false,
        },
        status: {
            type: sequelize.BOOLEAN,
            defaultValue: true,
        },
    });

    Area.belongsTo(City, { foreignKey: "city_id" })
    Area.belongsTo(LocationSide, { foreignKey: "location_side_id" })

    return {
        Area,
    };
};
