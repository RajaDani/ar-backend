module.exports = function mdlBusiness(opts) {
  const { sequelize, sequelizeCon, mdlLocationSide } = opts;
  const { LocationSide } = mdlLocationSide;
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
    password: {
      type: sequelize.STRING,
      allowNull: false,
    },
    delivery_charges: {
      type: sequelize.INTEGER,
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
    off_days: {
      type: sequelize.STRING,
      allowNull: true,
    },
    in_city: {
      type: sequelize.BOOLEAN,
      defaultValue: true,
    },
    store_spec: {
      type: sequelize.STRING,
      allowNull: true,
    },
    store_discount: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    discount_alloted: {
      type: sequelize.BOOLEAN,
      defaultValue: false,
    },
    youtube_link: {
      type: sequelize.STRING,
      allowNull: true,
    },
    ordering_num: {
      type: sequelize.INTEGER,
      defaultValue: 1,
    }
  });

  Business.belongsTo(LocationSide, { foreignKey: "location_side_id" });
  // Business.belongsToMany(Category, { through: "business_cateogries" });
  //   Business.hasOne(Item, {
  //     foreignKey: "business_id",
  //     foreignKeyConstraint: true,
  //   });

  return {
    Business,
  };
};
