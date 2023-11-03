module.exports = function mdlUser(opts) {
    const { sequelize, sequelizeCon, mdlCity } = opts;
    const { City } = mdlCity;
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
        status: {
            type: sequelize.BOOLEAN,
            defaultValue: true,
        },
    });
    Area.belongsTo(City, { foreignKey: "city_id" })
    return {
        Area,
    };
};
