module.exports = function mdlCity(opts) {
    const { sequelize, sequelizeCon, mdlCategory, mdlBusiness } = opts;

    const { Business } = mdlBusiness;
    const { Category } = mdlCategory;

    const BusinessCategory = sequelizeCon.define("business_category", {
        id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
    });

    BusinessCategory.belongsTo(Business, { foreignKey: 'business_id' });
    BusinessCategory.belongsTo(Category, { foreignKey: 'category_id' });

    return { BusinessCategory };
};

