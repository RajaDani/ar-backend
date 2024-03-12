module.exports = function svcAdminDashboard(opts) {
  const {
    sequelize,
    sequelizeCon,
    mdlOrder,
    mdlItem,
    cloudinary,
    Op,
    mdlUser,
    mdlCustomerAddress,
    mdlRider,
    mdlServiceTime,
    mdlMembership,
    mdlOrderItems
  } = opts;
  const { Order } = mdlOrder;
  const { Item } = mdlItem;
  const { User } = mdlUser;
  const { CustomerAddress } = mdlCustomerAddress;
  const { Rider } = mdlRider;
  const { ServiceTime } = mdlServiceTime;
  const { Membership } = mdlMembership;
  const { OrderItem } = mdlOrderItems;

  async function getDashboardAnalytics() {
    const orders = await Order.findOne({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.col("delivery_charges")),
          "delivery_earnings",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "total_orders"],
      ],
      raw: true
    });

    console.log("orders", orders)
    const profit = await OrderItem.findOne({
      attributes: [[sequelize.fn("SUM", sequelize.col("order_item_profit")), "order_profit"]],
      raw: true
    })

    let orderData = { ...orders };
    orderData["order_profit"] = profit?.order_profit;
    const items = await Item.findOne({
      attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "total_items"]],
    });
    const data = { orders: orderData, items };
    return data;
  }

  async function getOrdersByCity() {
    const orders = await sequelizeCon.query(
      `
        SELECT city.name AS cityName, COUNT(orders.id) AS orderCount
        FROM orders
        INNER JOIN areas ON orders.area_id = areas.id
        INNER JOIN cities AS city ON areas.city_id = city.id
        GROUP BY cityName;
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return orders;
  }

  var timeFrom = (X) => {
    var dates = [];
    for (let I = 0; I < Math.abs(X); I++) {
      dates.push(
        new Date(
          new Date().getTime() - (X >= 0 ? I : I - I - I) * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-GB")
      );
    }
    return dates;
  };

  async function getOrdersByWeek() {
    const last7days = new Date();
    last7days.setDate(last7days.getDate() - 7);
    const days = timeFrom(7);

    const orders = await Order.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%d/%m/%Y"),
          "date",
        ],
        // [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%b'), 'month_name'],
        [sequelize.fn("COUNT", sequelize.col("id")), "orders"],
      ],
      where: {
        createdAt: {
          [Op.gte]: last7days,
        },
      },
      group: [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%d/%m/%Y"),
      ],
      order: sequelize.literal("date ASC"),
    });

    let stringify = JSON.stringify(orders);
    let data = JSON.parse(stringify);
    let dates = data.map((x) => x.date);

    let orderData = data;
    for (let i = 0; i < days.length; i++) {
      if (!dates.includes(days[i]))
        orderData.push({ date: days[i], orders: 0 });
    }

    orderData.sort((a, b) => {
      return parseInt(a.date) - parseInt(b.date);
    });

    return orderData;
  }

  async function getLatestTransactions() {
    const orders = await Order.findAll({
      limit: 10,
      order: [["id", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Rider,
          attributes: ["name"],
        },
      ],
    });

    return orders;
  }

  async function getMemberships() {
    return await Membership.findAll({
      attributes: ["id", "name", "image", "description", "price"],
      where: { status: 1 },
    });
  }

  async function updateMembership(params, body) {
    const { image } = body;
    if (image?.length > 200) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image);
      body["image"] = secure_url;
    }
    return await Membership.update(body, { where: { id: params.id } });
  }

  return {
    getDashboardAnalytics,
    getOrdersByCity,
    getOrdersByWeek,
    getLatestTransactions,
    getMemberships,
    updateMembership,
  };
};
