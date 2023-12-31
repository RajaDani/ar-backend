module.exports = function svcBusiness(opts) {
  const {
    mdlBusiness,
    mdlCategory,
    encryption,
    Op,
    sequelize,
    cloudinary,
    mdlBusinessCategory,
    mdlBusinessCity,
    mdlCity,
    mdlItem,
    config,
    mdlBusinessReview,
    mdlLocationSide,
    Boom,
  } = opts;
  const { Business } = mdlBusiness;
  const { Category } = mdlCategory;
  const { BusinessCity } = mdlBusinessCity;
  const { BusinessCategory } = mdlBusinessCategory;
  const { City } = mdlCity;
  const { Item } = mdlItem;
  const { LocationSide } = mdlLocationSide;
  const { BusinessReview } = mdlBusinessReview;

  async function getBusinesses(params) {
    const businesses = await Business.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "contact",
        "address",
        "rating",
        "image_url",
        "off_days",
        "in_city",
      ],
      include: [
        {
          model: LocationSide,
          attributes: ["name"],
        },
      ],
      where: {
        status: 1,
      },
    });
    return businesses;
  }

  async function getBusinessByCategory(params) {
    const { categoryId } = params;
    const businesses = await BusinessCategory.findAll({
      attributes: [],
      include: [
        {
          model: Business,
          attributes: [
            "id",
            "name",
            "image_url",
            "rating",
            "description",
            "location_side_id",
          ],
          where: { status: true },
        },
      ],
      where: { category_id: categoryId },
    });
    return businesses;
  }

  async function getBusinessByID(params) {
    const category = await BusinessCategory.findOne({
      attributes: ["category_id"],
      where: { business_id: params.id },
    });
    const city = await BusinessCity.findOne({
      attributes: ["city_id"],
      where: { business_id: params.id },
    });

    const business = await Business.findOne({
      attributes: [
        "id",
        "name",
        "email",
        "contact",
        "longitude",
        "latitude",
        "start_time",
        "end_time",
        "availability",
        "address",
        "rating",
        "image_url",
        "store_spec",
        "off_days",
        "in_city",
        "location_side_id",
        "delivery_charges",
      ],
      include: [
        {
          model: LocationSide,
          attributes: ["name"],
        },
      ],
      where: {
        id: params.id,
      },
    });

    business["category_id"] = category.category_id;
    business["city_id"] = city.city_id;
    return {
      business,
      category_id: category.category_id,
      city_id: city.city_id,
    };
  }

  async function getFeaturedBusiness(params) {
    const business = await Business.findAll({
      where: {
        [Op.or]: [{ rating: 4 }, { rating: 5 }],
      },
    });
    return business;
  }

  async function getBusinessBySubCategory(params) {
    const { subCategoryId } = params;
    const ids = await Item.findAll({
      attributes: [
        sequelize.fn("DISTINCT", sequelize.col("business_id")),
        "business_id",
      ],
      where: {
        subcategory_id: subCategoryId,
        status: 1,
      },
      raw: true,
    });
    const businessIds = ids.map((item) => item.business_id);
    const businesses = await Business.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "contact",
        "address",
        "rating",
        "image_url",
        "location_side_id",
        "off_days",
        "in_city",
      ],
      where: {
        status: 1,
        id: { [Op.in]: businessIds },
      },
    });

    return businesses;
  }

  async function addBusiness(params) {
    const { image_url, category_id, city_id } = params;
    delete params["image_url"];
    delete params["category_id"];
    delete params["city_id"];
    const { email, password } = params;
    const count = await Business.count({ where: { email: email } });
    if (count > 0) throw Boom.conflict("Email already exists!");
    const pass = encryption.hashPassword(password, config);
    params.password = pass;
    if (image_url) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      params["image_url"] = secure_url;
    }
    const business = await Business.create(params);
    if (business) {
      await BusinessCategory.create({
        business_id: business.id,
        category_id: category_id,
      });
      await BusinessCity.create({
        business_id: business.id,
        city_id: city_id,
      });
    }
    return business;
  }

  async function addBusinessReview(params) {
    const review = await BusinessReview.create(params);
    return review.id;
  }

  async function updateBusiness(params, data) {
    const { image_url, city_id, category_id } = data;
    delete data["city_id"];
    delete data["category_id"];

    if (image_url?.length > 200) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      data["image_url"] = secure_url;
    }
    const business = await Business.update(data, {
      where: {
        id: params.id,
      },
    });

    if (business) {
      BusinessCategory.update(
        { category_id },
        { where: { business_id: params.id } }
      );
      BusinessCity.update({ city_id }, { where: { business_id: params.id } });
    }

    return business;
  }

  async function deleteBusinessByID(params) {
    const business = await Business.update(
      {
        status: 0,
      },
      {
        where: {
          id: params.id,
        },
      }
    );
    return business;
  }
  // async function searchBusiness(params) {
  //   const { name } = params;

  //   const business = await Business.findAll({
  //     attributes: [
  //       "id",
  //       "name",
  //       "email",
  //       "contact",
  //       "address",
  //       "rating",
  //       "image_url",
  //     ],
  //     where: {
  //       name: {
  //         [Op.like]: `%${name}%`,
  //       },
  //       status: 1,
  //     },
  //   });

  //   return business;
  // }
  async function searchBusinessByCategory(params) {
    const { categoryId, name } = params;
    const businesses = await BusinessCategory.findAll({
      attributes: [],
      include: [
        {
          model: Business,
          attributes: [
            "id",
            "name",
            "image_url",
            "rating",
            "description",
            "off_days",
            "in_city",
          ],
          where: {
            name: {
              [Op.like]: `%${name}%`,
            },
            status: true,
          },
        },
      ],
      where: {
        category_id: categoryId,
      },
    });
    return businesses;
  }
  async function searchBusiness(params) {
    const { name } = params;

    const businesses = await Business.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "contact",
        "address",
        "rating",
        "image_url",
        "off_days",
        "in_city",
      ],
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
        status: 1,
      },
    });

    return businesses;
  }
  return {
    getBusinesses,
    getBusinessByCategory,
    getBusinessBySubCategory,
    getBusinessByID,
    getFeaturedBusiness,
    addBusiness,
    addBusinessReview,
    updateBusiness,
    deleteBusinessByID,
    searchBusinessByCategory,
    searchBusiness,
  };
};
