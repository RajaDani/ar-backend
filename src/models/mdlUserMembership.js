module.exports = function mdlUserMembership(opts) {
    const { sequelize, sequelizeCon, mdlUser } = opts;

    const { User } = mdlUser;
    const UserMembership = sequelizeCon.define("user_membership", {
        id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        card_type: {
            type: sequelize.STRING,
            allowNull: false
        },
        payment_method: {
            type: sequelize.STRING,
            allowNull: false
        },
        card_status: {
            type: sequelize.STRING,
            defaultValue: "pending"
        },
        address_1: {
            type: sequelize.STRING,
            allowNull: false
        },
        address_2: {
            type: sequelize.STRING,
            allowNull: true
        },
        card_expiry: {
            type: sequelize.STRING,
            allowNull: true
        },
        status: {
            type: sequelize.BOOLEAN,
            defaultValue: true
        }
    });

    UserMembership.belongsTo(User, { foreignKey: "user_id" });

    return { UserMembership };
};

