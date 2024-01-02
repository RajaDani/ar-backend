module.exports = function mdlUser(opts) {
    const { sequelize, sequelizeCon, mdlItem, mdlUser, mdlCustomerAddress } = opts;
    const { Item } = mdlItem;
    const { User } = mdlUser;
    const { CustomerAddress } = mdlCustomerAddress;

    const Appointment = sequelizeCon.define("appointment", {
        id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        appointment_fee: {
            type: sequelize.INTEGER,
            allowNull: false,
        },
        platform_fee: {
            type: sequelize.INTEGER,
            allowNull: false,
        },
        app_holder_name: {
            type: sequelize.STRING,
            allowNull: true,
        },
        app_holder_address: {
            type: sequelize.STRING,
            allowNull: true,
        },
        appointment_type: {
            type: sequelize.STRING,
            allowNull: false,
        },
        appointment_date: {
            type: sequelize.STRING,
            allowNull: false,
        },
        appointment_time: {
            type: sequelize.STRING,
            allowNull: false,
        },
        appointment_progress: {
            type: sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: sequelize.BOOLEAN,
            defaultValue: true,
        },
        payment_method: {
            type: sequelize.INTEGER,
            allowNull: false,
        },
        posted_by: {
            type: sequelize.INTEGER,
            allowNull: false,
        }
    });

    Appointment.belongsTo(Item, { foreignKey: 'item_id' });
    Appointment.belongsTo(User, { foreignKey: 'customer_id' });

    return {
        Appointment,
    };
};
