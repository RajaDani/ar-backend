module.exports = function mdlUser(opts) {
  const { sequelize, mdlCategory, sequelizeCon } = opts;
  const { Category } = mdlCategory;
  //   const { Item } = mdlItem;

  const Business = sequelizeCon.define("business", {
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
    description: {
      type: sequelize.STRING,
      allowNull: true,
    },
    latitude: {
      type: sequelize.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: sequelize.FLOAT,
      allowNull: true,
    },
    address: {
      type: sequelize.STRING,
      allowNull: false,
    },
    contact: {
      type: sequelize.BIGINT,
      allowNull: false,
    },
    email: {
      type: sequelize.STRING,
      allowNull: false,
    },
    rating: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
    image_url: {
      type: sequelize.STRING,
      allowNull: true,
    },
    start_time: {
      type: sequelize.TIME,
      allowNull: false,
    },
    end_time: {
      type: sequelize.TIME,
      allowNull: false,
    },
    availability: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  // Business.belongsToMany(Category, { through: "business_cateogries" });
  //   Business.hasOne(Item, {
  //     foreignKey: "business_id",
  //     foreignKeyConstraint: true,
  //   });

  return {
    Business,
  };
};
