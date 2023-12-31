module.exports = function svcOrder(opts) {
  const {
    mdlOrder,
    mdlOrderItems,
    mdlItem,
    mdlUser,
    mdlCustomerAddress,
    mdlBusiness,
    cloudinary,
    Op,
    mdlRider,
    mdlArea,
    sequelize,
    sequelizeCon,
    mdlCity,
    config,
    mdlAdmin,
    nodemailer,
  } = opts;
  const { Order } = mdlOrder;
  const { Business } = mdlBusiness;
  const { User } = mdlUser;
  const { OrderItem } = mdlOrderItems;
  const { Item } = mdlItem;
  const { Rider } = mdlRider;
  const { CustomerAddress } = mdlCustomerAddress;
  const { Area } = mdlArea;
  const { City } = mdlCity;
  const { Admin } = mdlAdmin;

  const sendEmail = async (email, orderData) => {
    const smtp = config.get("smtpConfig");
    const transporter = nodemailer.createTransport(smtp);
    const emails = email.toString();
    const { total } = orderData;

    try {
      await transporter.sendMail({
        from: '"AR Home Services" <arhomeservices@gmail.com>',
        to: `${emails}`,
        subject: `Order Placed`,
        html: `<p>A new order placed of total ${total} pkr has been placed!</p>`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  async function getOrders(params) {
    const { limit, offset } = params;
    Order.sync();
    OrderItem.sync();
    const count = await Order.count({
      where: { status: 1 },
    });
    const sql = `SELECT o.id,o.total,o.createdAt,CASE WHEN o.posted_by = 1 THEN 'Client'
      WHEN o.posted_by = 2 THEN 'Admin' ELSE o.posted_by END AS posted_by,o.progress_status,o.address,o.delivery_time,
      c.name AS city_name,GROUP_CONCAT(oi.item_id) AS item_ids,GROUP_CONCAT(oi.order_item_profit) AS profits,
      GROUP_CONCAT(it.name) AS item_names,SUM(oi.order_item_profit) AS total_profit,
      GROUP_CONCAT(b.name) AS business_names,r.name AS rider_name 
      FROM orders AS o 
      LEFT JOIN order_items AS oi ON oi.order_id = o.id 
      LEFT JOIN items AS it ON it.id = oi.item_id 
      LEFT JOIN businesses AS b ON b.id = it.business_id 
      LEFT JOIN customers AS u ON u.id = o.customer_id 
      LEFT JOIN riders AS r ON r.id = o.rider_id 
      LEFT JOIN cities AS c ON c.id = o.city_id 
      WHERE o.status = 1 GROUP BY o.id,o.progress_status 
      ORDER BY CASE WHEN progress_status = 'pending' THEN 0 ELSE 1 END LIMIT :offset, :limit`;

    const orders = await sequelizeCon.query(sql, {
      replacements: {
        offset: +offset,
        limit: +limit,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    return { orders, count };
  }

  async function getOrderByID(params) {
    const order = await Order.findOne({
      attributes: [
        "id",
        "customer_id",
        "address",
        "area_id",
        "order_note",
        "delivery_charges",
        "discount",
        "delivery_time",
        "profit",
        "other_charges",
        "other_discount",
        "progress_status",
        "order_bill_image",
        "rider_id",
        "total",
      ],
      where: { id: params.id },
      include: [
        { model: User, attributes: ["name"] },
        {
          model: Area,
          attributes: ["name", "city_id"],
          include: [{ model: City, attributes: ["name"] }],
        },
        {
          model: Rider,
          attributes: ["name"],
          required: false,
        },
        {
          model: OrderItem,
          attributes: [
            "order_item_name",
            "order_item_price",
            "order_item_quantity",
            "item_id",
            "business_id",
            "order_item_profit",
          ],
          where: { order_id: params.id },
          include: [
            { model: Item, attributes: ["name", "price", "image_url"] },
          ],
        },
      ],
    });

    let orderData = {};

    if (order) {
      let stringifyData = JSON.stringify(order);
      orderData = JSON.parse(stringifyData);
      orderData["customer"] = orderData["customer"].name;
      const { city_id, name, city } = orderData["area"];
      orderData["area"] = name;
      orderData["city_id"] = city_id;
      orderData["rider"] = orderData["rider"]?.name;
      orderData["city"] = city.name;
      let orderItems = orderData.order_items;

      let formattedItems = orderItems.map((x) => {
        return {
          id: x.item_id,
          name: x.order_item_name,
          quantity: x.order_item_quantity,
          new_price: x.order_item_price,
          price: x.item?.price,
          image_url: x.item?.image_url,
          business_id: x?.business_id,
          profit: x?.order_item_profit,
        };
      });
      delete orderData["order_items"];
      orderData["item"] = formattedItems;
    }
    return orderData;
  }
  async function getOrdersByBusiness(params) {
    const { id } = params;
    const orderIds = await OrderItem.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("order_id")), "order_id"],
      ],
      where: { business_id: id },
    });
    // Extract order_ids from the result and return them as an array
    const Ids = orderIds.map((orderItem) => orderItem.order_id);
    if (Ids.length) {
      // const orders = await Order.findAll({
      //   where: {
      //     id: {
      //       [sequelize.Op.in]: Ids,
      //     },
      //   },
      // });

      // return orders;
      const sql = `SELECT o.id, o.total, o.createdAt,
      CASE 
      WHEN o.posted_by = 1 THEN 'Client'
      WHEN o.posted_by = 2 THEN 'Admin' 
      ELSE o.posted_by 
      END AS posted_by,
      o.progress_status, o.address,
      c.name AS city_name,
      GROUP_CONCAT(oi.item_id) AS item_ids,
      GROUP_CONCAT(it.name) AS item_names,
      GROUP_CONCAT(b.name) AS business_names,
      r.name AS rider_name 
      FROM 
      orders AS o 
      LEFT JOIN order_items AS oi ON oi.order_id = o.id 
      LEFT JOIN items AS it ON it.id = oi.item_id 
      LEFT JOIN businesses AS b ON b.id = it.business_id 
      LEFT JOIN customers AS u ON u.id = o.customer_id 
      LEFT JOIN riders AS r ON r.id = o.rider_id 
      LEFT JOIN cities AS c ON c.id = o.city_id 
      WHERE 
      o.status = 1 
      AND o.id IN (${Ids.join(
        ", "
      )}) -- Use IN clause for filtering by order IDs
  GROUP BY 
    o.id`;

      const orders = await sequelizeCon.query(sql, {
        type: sequelize.QueryTypes.SELECT,
      });

      return orders;
    }
    return Ids;
  }

  async function searchOrders(params) {
    const { limit, offset } = params;
    delete params["limit"];
    delete params["offset"];
    let data = {};
    const count = await Order.count({
      where: { status: 1 },
    });

    // for (let x in params) {
    //   if (params[x] != null && params[x] != "") {
    //     if (x == "createdAt") data[x] = { [Op.gt]: `%${params[x]}%` };
    //     else data[x] = params[x];
    //   }
    // }

    let whereClause = "WHERE ";

    for (let x in params) {
      if (params[x] != null && params[x] != "") {
        if (x === "createdAt") {
          var createdAt = new Date(params[x]);
          var nextDay = new Date(createdAt);
          nextDay.setDate(createdAt.getDate() + 1);
          var year = nextDay.getFullYear();
          var month = String(nextDay.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
          var day = String(nextDay.getDate()).padStart(2, "0");

          var formattedDate = `${year}-${month}-${day}`;
          whereClause += ` o.createdAt >= '${params[x]}' AND o.createdAt < '${formattedDate}' AND `;
        } else {
          whereClause += `o.${x} = '${params[x]}' AND `;
        }
      }
    }

    const condition = whereClause.slice(0, whereClause.length - 4);

    const sql = `SELECT o.id,o.total,o.createdAt,CASE WHEN o.posted_by = 1 THEN 'Client'
      WHEN o.posted_by = 2 THEN 'Admin' ELSE o.posted_by END AS posted_by,o.progress_status,o.address,o.admin_edited,
      o.order_processing_time,o.order_deliver_time,o.delivery_time,GROUP_CONCAT(oi.item_id) AS item_ids,
      GROUP_CONCAT(it.name) AS item_names,c.name AS city_name,
      GROUP_CONCAT(oi.order_item_profit) AS profits,SUM(oi.order_item_profit) AS total_profit,
       GROUP_CONCAT(b.name) AS business_names,r.name AS rider_name 
      FROM orders AS o 
      LEFT JOIN order_items AS oi ON oi.order_id = o.id 
      LEFT JOIN items AS it ON it.id = oi.item_id 
      LEFT JOIN businesses AS b ON b.id = it.business_id 
      LEFT JOIN customers AS u ON u.id = o.customer_id 
      LEFT JOIN riders AS r ON r.id = o.rider_id 
      LEFT JOIN cities AS c ON c.id = o.city_id 
      ${condition} GROUP BY o.id LIMIT :offset, :limit`;

    const orders = await sequelizeCon.query(sql, {
      replacements: {
        offset: +offset,
        limit: +limit,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    return { orders, count };
  }

  async function addOrder(params) {
    const { item, custom_item } = params;
    delete params["item"];
    delete params["custom_item"];

    const order = await Order.create(params);
    if (custom_item?.length > 0) {
      let customData = await createCustomItem(custom_item);
      let items = await Item.bulkCreate(customData);
      const stringify = JSON.stringify(items);
      const parseData = JSON.parse(stringify);

      for (let x in parseData) {
        for (let y in custom_item)
          if (parseData[x].name == custom_item[y].name) {
            parseData[x].quantity = custom_item[y].quantity;
            parseData[x].profit = custom_item[y].profit;
          }
      }

      parseData.map((x) =>
        item.push({
          id: x.id,
          name: x.name,
          quantity: x.quantity,
          new_price: x.price,
          business_id: x?.business_id ?? null,
          profit: x?.profit,
        })
      );
    }

    const itemData = await mapItemData(item, order.id);

    if (order) {
      await OrderItem.bulkCreate(itemData);
    }
    const email = await Admin.findAll({
      attributes: ["email"],
      where: { status: 1 },
    });
    const emailsList = email.map((x) => x.email);
    sendEmail(emailsList, params);
    return order.id;
  }

  async function updateOrder(params, data) {
    const { id } = params;
    const { order_bill_image, item, custom_item } = data;

    delete data["order_bill_image"];
    delete data["item"];
    delete data["custom_item"];

    if (order_bill_image) {
      const { secure_url } = await cloudinary.v2.uploader.upload(
        order_bill_image
      );
      params["order_bill_image"] = secure_url;
    }

    const order = await Order.update(data, { where: { id } });

    if (custom_item?.length > 0) {
      let customData = await createCustomItem(custom_item);
      let items = await Item.bulkCreate(customData);
      const stringify = JSON.stringify(items);
      const parseData = JSON.parse(stringify);

      for (let x in parseData) {
        for (let y in custom_item)
          if (parseData[x].name == custom_item[y].name) {
            parseData[x].quantity = custom_item[y].quantity;
            parseData[x].profit = custom_item[y].profit;
          }
      }
      parseData.map((x) =>
        item.push({
          id: x.id,
          name: x.name,
          quantity: x.quantity,
          new_price: x.price,
          business_id: x?.business_id ?? null,
          profit: x?.profit,
        })
      );
    }

    const itemData = await mapItemData(item, id);
    if (order) {
      await OrderItem.bulkCreate(itemData, {
        updateOnDuplicate: [
          "order_item_quantity",
          "order_item_price",
          "order_item_name",
          "createdAt",
          "updatedAt",
        ],
      });
    }
    return id;
  }

  async function quickUpdateOrder(params, body) {
    const { id } = params;
    const order = await Order.update(body, { where: { id } });

    return order;
  }

  async function deleteOrderByID(params) {
    const order = await Order.update(
      { status: 0 },
      { where: { id: params.id } }
    );
    return order;
  }

  async function createCustomItem(custom_item) {
    let customData = custom_item.map((x) => ({
      name: x.name,
      price: x.price,
      quantity: x.quantity,
      item_type: "single",
      business_id: x?.business_id ?? null,
      status: 0,
    }));

    return customData;
  }

  function mapItemData(item, id) {
    return item.map((x) => ({
      item_id: x.id,
      order_id: id,
      order_item_name: x.name,
      order_item_price: x.new_price,
      order_item_quantity: x.quantity,
      business_id: x.business_id,
      order_item_profit: x?.profit,
    }));
  }

  return {
    getOrders,
    getOrderByID,
    searchOrders,
    addOrder,
    updateOrder,
    quickUpdateOrder,
    deleteOrderByID,
    getOrdersByBusiness,
  };
};
