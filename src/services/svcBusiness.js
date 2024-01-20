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
    mdlUser,
    mdlOrderItems,
    sequelizeCon,
    nodemailer,
    mdlAdmin,
  } = opts;
  const { Business } = mdlBusiness;
  const { Category } = mdlCategory;
  const { BusinessCity } = mdlBusinessCity;
  const { BusinessCategory } = mdlBusinessCategory;
  const { City } = mdlCity;
  const { Item } = mdlItem;
  const { LocationSide } = mdlLocationSide;
  const { BusinessReview } = mdlBusinessReview;
  const { User } = mdlUser;
  const { OrderItem } = mdlOrderItems;
  const { Admin } = mdlAdmin;

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
        "discount_alloted",
        "youtube_link",
        [
          sequelize.literal(
            "(SELECT COUNT(DISTINCT `order_id`) FROM `order_items` WHERE `order_items`.`business_id` = `business`.`id`)"
          ),
          "total_orders",
        ],
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
      order: [["ordering_num", "ASC"]],
    });
    return businesses;
  }

  async function joinBusinessRequest(body) {
    const admins = await Admin.findAll({
      attributes: ["email"],
      where: { status: 1 },
      raw: true,
    });

    const emails = admins.map((x) => x.email);
    const smtp = config.get("smtpConfig");
    const transporter = nodemailer.createTransport(smtp);
    const emailList = emails.toString();

    try {
      await transporter.sendMail({
        from: `AR Home Services" <arhomeservices@gmail.com>`,
        to: `${emailList}`,
        subject: `New Business Add Request!`,
        html:
          `<b>New Business "${body.business_name}" requested to join AR Home Services.</b>` +
          `<ul>
          <li>Name : ${body.business_name}</li>
          <li>Owner Name : ${body.business_owner_name}</li>
          <li>Address : ${body.address}</li>
          <li>Google Location : ${body.google_location}</li>
          <li>Business Category : ${body.business_category}</li>
          <li>Type of Items : ${body.item_types}</li>
          <li>Contact 1 : ${body.contact_1}</li>
          <li>Contact 2 : ${body.contact_2}</li>
          <li>Business timings : ${body.business_timings}</li>
          </ul>`,
      });
    } catch (err) {
      console.log(err);
    }
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
            "discount_alloted",
            "youtube_link",
            [
              sequelize.literal(
                "(SELECT COUNT(DISTINCT `order_id`) FROM `order_items` WHERE `order_items`.`business_id` = `business`.`id`)"
              ),
              "total_orders",
            ],
          ],
          where: { status: true },
          order: [["ordering_num", "ASC"]],
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
        "discount_alloted",
        "youtube_link",
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

  async function getBusinessReviews(params) {
    const reviews = await BusinessReview.findAll({
      include: [
        {
          model: Business,
          attributes: ["name"],
        },
        {
          model: User,
          attributes: ["name"],
        },
      ],
      where: { status: 1 },
    });
    return reviews;
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

    const query =
      `SELECT b.id,b.name,b.email,b.youtube_link,b.ordering_num,b.contact,b.address,b.rating,b.image_url,b.location_side_id,b.discount_alloted, ` +
      `b.off_days,b.in_city,  COUNT(DISTINCT oi.order_id) AS total_orders ` +
      `FROM businesses AS b ` +
      `LEFT JOIN order_items oi ON oi.business_id = b.id ` +
      `WHERE b.status = 1 AND b.id IN (${businessIds}) ` +
      `GROUP BY b.id, b.name, b.email, b.contact, b.address, b.rating, b.image_url, b.location_side_id, b.off_days, b.in_city ` +
      `ORDER BY b.ordering_num ASC`;

    const businesses = await sequelizeCon.query(query, {
      type: sequelize.QueryTypes.SELECT,
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

  async function readBusinessReview(params) {
    const { business_id } = params;
    console.log("business_id", business_id);
    const reviews = await BusinessReview.findAll({
      attributes: ["id", "title", "description", "rating"],
      where: { business_id },
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
      ],
    });
    return reviews;
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

  async function deleteBusinessReview(params) {
    const business = await BusinessReview.destroy({
      where: { id: params.id },
    });
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
            [
              sequelize.literal(
                "(SELECT COUNT(DISTINCT `order_id`) FROM `order_items` WHERE `order_items`.`business_id` = `business`.`id`)"
              ),
              "total_orders",
            ],
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
        "ordering_num",
        [
          sequelize.literal(
            "(SELECT COUNT(DISTINCT `order_id`) FROM `order_items` WHERE `order_items`.`business_id` = `business`.`id`)"
          ),
          "total_orders",
        ],
      ],
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
        status: 1,
      },
      order: [["ordering_num", "ASC"]],
    });

    return businesses;
  }
  return {
    getBusinesses,
    getBusinessByCategory,
    getBusinessBySubCategory,
    getBusinessReviews,
    getBusinessByID,
    getFeaturedBusiness,
    addBusiness,
    addBusinessReview,
    updateBusiness,
    deleteBusinessByID,
    deleteBusinessReview,
    searchBusinessByCategory,
    searchBusiness,
    readBusinessReview,
    joinBusinessRequest,
  };
};
