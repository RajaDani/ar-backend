const { includes } = require("lodash");

module.exports = function svcRider(opts) {
  const {
    sequelizeCon,
    sequelize,
    mdlRider,
    config,
    encryption,
    cloudinary,
    mdlCity,
    mdlRiderReview,
    mdlRiderBills,
    mdlUser,
    mdlRiderHistory,
    Op
  } = opts;
  const { Rider } = mdlRider;
  const { City } = mdlCity;
  const { RiderReview } = mdlRiderReview;
  const { RiderBills } = mdlRiderBills;
  const { User } = mdlUser;
  const { RiderHistory } = mdlRiderHistory;

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
        "job_start_time",
        "job_end_time",
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
      attributes: ["id", "name", "email", "contact", "address", "image_url",
        "job_start_time", "job_end_time", "job_type", "off_days", "city_id"],
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

  async function getRiderReviews(params) {
    const reviews = await RiderReview.findAll({
      include: [{
        model: Rider,
        attributes: ["name"]
      },
      {
        model: User,
        attributes: ["name"]
      }
      ],
      where: { status: 1 },
    });
    return reviews;
  }

  async function addRider(params) {
    const { image_url, password } = params;
    const { id } = identity;
    params["admin_id"] = id;

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

  async function addRiderReview(params) {
    const review = await RiderReview.create(params);
    return review.id;
  }

  async function addRiderBills(params) {
    const { image } = params;
    delete params["image"];
    if (image) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image);
      params["image"] = secure_url;
    }

    const bill = await RiderBills.create(params);
    return bill.id;
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

  async function updateRiderStatus(params, data) {
    const { id } = params;

    if (data?.rider_job_start) {
      await RiderHistory.create({ start_time: data.rider_job_start, rider_id: id })
    }
    if (data?.rider_job_end) {
      const maxIdRow = await RiderHistory.findOne({ attributes: [[sequelize.fn('MAX', sequelize.col('id')), 'max_id']], raw: true });
      if (maxIdRow.max_id) {
        await RiderHistory.update({ end_time: data?.rider_job_end }, { where: { id: maxIdRow.max_id } })
      }
    }

    const rider = await Rider.update(data, { where: { id }, });
    return rider;
  }

  async function deleteRiderByID(params) {
    const rider = await Rider.update(
      { status: 0 },
      { where: { id: params.id } }
    );
    return rider;
  }

  async function deleteRiderReview(params) {
    const rider = await RiderReview.destroy({ where: { id: params.id } });
    return rider;
  }

  async function getRiderOrders(params) {
    const { id } = params;

    const sql = `SELECT o.id,o.total,o.rider_accepted_order,o.createdAt,o.order_processing_time,CASE WHEN o.posted_by = 1 THEN 'Client'
    WHEN o.posted_by = 2 THEN 'Admin' ELSE o.posted_by END AS posted_by,o.progress_status,o.address,
    c.name AS city_name,GROUP_CONCAT(oi.item_id) AS item_ids,GROUP_CONCAT(oi.order_item_name) AS item_names,
    GROUP_CONCAT(b.name) AS business_names,r.name AS rider_name 
    FROM orders AS o 
    LEFT JOIN order_items AS oi ON oi.order_id = o.id 
    LEFT JOIN items AS it ON it.id = oi.item_id 
    LEFT JOIN businesses AS b ON b.id = it.business_id 
    LEFT JOIN customers AS u ON u.id = o.customer_id 
    LEFT JOIN riders AS r ON r.id = o.rider_id 
    LEFT JOIN cities AS c ON c.id = o.city_id 
    WHERE o.status = 1 AND o.progress_status != 'pending' AND o.progress_status != 'cancel' AND o.progress_status != 'delivered' AND o.rider_id =${id} GROUP BY o.id,o.progress_status,o.order_processing_time ` +
      `ORDER BY CASE WHEN progress_status = 'processing' THEN 0 ELSE 1 END,o.order_processing_time DESC`;

    const orders = await sequelizeCon.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    return orders;
  }

  async function getRiderStats(params) {
    const { id, createdAt } = params;

    const sql = `SELECT r.name,r.contact,r.off_days,r.job_start_time,r.job_end_time,r.job_type,` +
      `SUM(CASE WHEN rh.createdAt >= '${createdAt + " 00:00:00"}' AND rh.createdAt < '${createdAt + " 23:59:59"}' THEN rh.start_time ELSE 0 END) AS start_time,` +
      `SUM(CASE WHEN rh.createdAt >= '${createdAt + " 00:00:00"}' AND rh.createdAt < '${createdAt + " 23:59:59"}' THEN rh.end_time ELSE 0 END) AS end_time,` +
      `c.name AS city_name FROM riders AS r ` +
      `LEFT JOIN rider_histories AS rh on rh.rider_id = ${id} ` +
      `LEFT JOIN cities AS c on c.id = r.city_id ` +
      `WHERE r.id = ${id} `

    const details = await sequelizeCon.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    return details[0];

  }

  async function getRiderDailyOrderList(riderList, formatTodayDate, formatNextDate) {
    const promises = await riderList.map(async x => {
      let query = `SELECT o.id,o.total,o.createdAt,CASE WHEN o.posted_by = 1 THEN 'Client' ` +
        `WHEN o.posted_by = 2 THEN 'Admin' ELSE o.posted_by END AS posted_by,o.progress_status,o.address,` +
        `o.order_processing_time,o.order_deliver_time,o.delivery_charges,` +
        `SUM(oi.order_item_profit) AS total_profit, c.name AS city_name,` +
        `r.name AS rider_name,r.rider_job_start,r.rider_job_end,` +
        `r.job_start_time,r.job_end_time,r.active,` +
        `a.name as area ,` +
        `(SELECT COUNT(*) FROM orders WHERE rider_id = ${x.id} AND createdAt >= '${formatTodayDate}' AND createdAt < '${formatNextDate}') AS total_orders ` +
        `FROM orders AS o ` +
        `LEFT JOIN order_items AS oi ON oi.order_id = o.id ` +
        `LEFT JOIN riders AS r ON r.id = o.rider_id ` +
        `LEFT JOIN cities AS c ON c.id = o.city_id ` +
        `LEFT JOIN areas AS a ON a.id = o.area_id ` +
        `WHERE r.active = 1 AND o.status = 1 AND o.rider_id =${x.id} AND o.createdAt >= '${formatTodayDate}' ` +
        `AND o.progress_status != 'pending' AND o.createdAt < '${formatNextDate}' GROUP BY o.id DESC LIMIT 5 ; `;

      let riderOrders = await sequelizeCon.query(query, {
        type: sequelize.QueryTypes.SELECT,
        raw: true
      });

      if (!riderOrders?.length) {
        riderOrders = [{
          rider_name: x.name, total_profit: 0,
          job_start_time: x.job_start_time,
          rider_job_start: x?.rider_job_start, rider_job_end: x?.rider_job_end, total_orders: 0
        }]
      }
      return riderOrders;
    });

    let riderData = await Promise.all(promises);
    riderData = riderData.filter(value => value !== null && value !== undefined);
    return riderData;
  }

  async function getIndividualRidersOrders() {
    const riders = await Rider.findAll({
      where: { status: 1, active: 1 },
      raw: true
    })

    const todayDate = new Date();
    const formatTodayDate = todayDate.toISOString().split('T')[0];

    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(todayDate);
    var nextDay = new Date(todayDate);
    nextDay.setDate(todayDate.getDate() + 1);

    const formatNextDate = nextDay.toISOString().split('T')[0];

    if (riders) {
      let riderData = await getRiderDailyOrderList(riders, formatTodayDate, formatNextDate);
      return riderData;
    }
  }

  return {
    getRiders,
    getRiderByID,
    getIndividualRidersOrders,
    getRiderReviews,
    addRider,
    addRiderReview,
    addRiderBills,
    updateRider,
    updateRiderStatus,
    deleteRiderByID,
    deleteRiderReview,
    getRiderOrders,
    getRiderStats
  };
};
