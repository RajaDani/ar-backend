module.exports = function svcRider(opts) {
  const {
    sequelizeCon,
    sequelize,
    mdlRider,
    config,
    encryption,
    cloudinary,
    mdlCity,
  } = opts;
  const { Rider } = mdlRider;
  const { City } = mdlCity;

  async function getRiders(params) {
    // sequelizeCon.sync({ force: true });
    const riders = await Rider.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "contact",
        "address",
        "image_url",
        "status",
      ],
      where: {
        status: 1,
      },
      include: [
        {
          model: City,
          attributes: ["id", "name"],
        },
      ],
    });
    return riders;
  }

  async function getRiderByID(params) {
    const rider = await Rider.findOne({
      attributes: ["id", "name", "email", "contact", "address", "image_url"],
      include: [
        {
          model: City,
          attributes: ["name"],
        },
      ],
      where: {
        id: params.id,
      },
    });
    return rider;
  }

  async function addRider(params) {
    const { image_url, password } = params;
    delete params["image_url"];
    delete params["password"];
    const pass = await encryption.hashPassword(password, config);
    params["password"] = pass;

    if (image_url) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      params["image_url"] = secure_url;
    }
    const rider = await Rider.create(params);

    return rider.id;
  }

  async function updateRider(params, data, identity) {
    const { image_url } = data;
    const { id } = identity;
    data["admin_id"] = id;

    if (image_url?.length > 200) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      data["image_url"] = secure_url;
    }
    const rider = await Rider.update(data, {
      where: {
        id: params.id,
      },
    });

    return rider;
  }

  async function deleteRiderByID(params) {
    const rider = await Rider.update(
      {
        status: 0,
      },
      {
        where: {
          id: params.id,
        },
      }
    );
    return rider;
  }
  async function getRiderOrders(params) {
    const { id } = params;

    const sql = `SELECT o.id,o.total,o.createdAt,CASE WHEN o.posted_by = 1 THEN 'Client'
    WHEN o.posted_by = 2 THEN 'Admin' ELSE o.posted_by END AS posted_by,o.progress_status,o.address,
    c.name AS city_name,GROUP_CONCAT(oi.item_id) AS item_ids,GROUP_CONCAT(it.name) AS item_names,
    GROUP_CONCAT(b.name) AS business_names,r.name AS rider_name 
    FROM orders AS o 
    LEFT JOIN order_items AS oi ON oi.order_id = o.id 
    LEFT JOIN items AS it ON it.id = oi.item_id 
    LEFT JOIN businesses AS b ON b.id = it.business_id 
    LEFT JOIN customers AS u ON u.id = o.customer_id 
    LEFT JOIN riders AS r ON r.id = o.rider_id 
    LEFT JOIN cities AS c ON c.id = o.city_id 
    WHERE o.status = 1 AND o.progress_status != 'pending' AND o.progress_status != 'cancel' AND o.rider_id =${id} GROUP BY o.id`;

    const orders = await sequelizeCon.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    return orders;
  }

  return {
    getRiders,
    getRiderByID,
    addRider,
    updateRider,
    deleteRiderByID,
    getRiderOrders,
  };
};
