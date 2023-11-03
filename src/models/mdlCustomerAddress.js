module.exports = function mdlCity(opts) {
  const { sequelize, mdlUser, sequelizeCon } = opts;

  const { User } = mdlUser;
  const CustomerAddress = sequelizeCon.define("customer_address", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    address_details: {
      type: sequelize.STRING,
      allowNull: false,
    },
    lat: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    lng: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  User.hasMany(CustomerAddress);
  CustomerAddress.belongsTo(User);

  return { CustomerAddress };
};

// Cities.hasOne(Bike, { foreignKey: 'id_city', foreignKeyConstraint: true });
