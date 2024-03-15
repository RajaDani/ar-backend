module.exports = function mdlBusinessCity(opts) {
    const { sequelize, sequelizeCon, mdlBusiness, mdlCity } = opts;

    const { Business } = mdlBusiness;
    const { City } = mdlCity;

    const BusinessCity = sequelizeCon.define("business_city", {
        id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
    });

    BusinessCity.belongsTo(Business, { foreignKey: 'business_id' });
    BusinessCity.belongsTo(City, { foreignKey: 'city_id' });

    return { BusinessCity };
};

