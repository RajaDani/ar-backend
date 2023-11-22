module.exports = function svcUser(opts) {
  const { sequelizeCon, sequelize, mdlUser, mdlOrder, mdlItem,
    mdlAppointment, mdlCustomerAddress, encryption, config, mdlCity, Boom } =
    opts;
  const { User } = mdlUser;
  const { Order } = mdlOrder;
  const { CustomerAddress } = mdlCustomerAddress;
  const { Appointment } = mdlAppointment;
  const { Item } = mdlItem;
  const { City } = mdlCity;

  async function getCustomers(params) {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "contact", "status"],
      where: {
        status: 1,
      },
      include: [{
        model: City,
        attributes: ["id", "name"]
      }]
    });
    return users;
  }

  async function getCustomerAddress(params) {
    // CustomerAddress.sync({ force: true })
    const { customerId } = params;
    const address = await CustomerAddress.findAll({
      attributes: ["id", "address_details"],
      include: [{
        model: User,
        where: { id: customerId },
        attributes: []
      }],
      where: {
        status: 1,
      },
    });
    return address;
  }

  async function getCustomerByID(params) {
    const user = await User.findOne({
      attributes: ["id", "name", "email", "contact"],
      where: {
        id: params.id,
      },
      include: [{
        model: CustomerAddress,
        attributes: ["address_details", "lat", "lng"],
        limit: 1
      },
      {
        model: City,
        attributes: ["name"]
      }
      ],
    });

    const stringifyData = JSON.stringify(user);
    const filteredData = JSON.parse(stringifyData);

    filteredData["address_details"] = filteredData.customer_addresses[0]?.address_details;
    filteredData["lat"] = filteredData.customer_addresses[0]?.lat;
    filteredData["lng"] = filteredData.customer_addresses[0]?.lng;
    delete filteredData["customer_addresses"]

    return filteredData;
  }

  async function getUserOrders(params) {
    const { id } = params;

    const sql = `SELECT o.id,o.total,o.createdAt,o.progress_status,
        GROUP_CONCAT(oi.item_id) AS item_ids,GROUP_CONCAT(it.name) AS item_names,
        GROUP_CONCAT(b.name) AS business_names 
        FROM orders AS o 
        LEFT JOIN order_items AS oi ON oi.order_id = o.id 
        LEFT JOIN items AS it ON it.id = oi.item_id 
        LEFT JOIN businesses AS b ON b.id = it.business_id 
        LEFT JOIN customers AS u ON u.id = o.customer_id 
        LEFT JOIN riders AS r ON r.id = o.rider_id 
        WHERE o.status = 1 AND o.customer_id =${id} GROUP BY o.id`

    const orders = await sequelizeCon.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    let current_orders = [];
    let past_orders = [];

    for (let order of orders) {
      if (order.progress_status == "cancelled" || order.progress_status == "completed") {
        past_orders.push(order);
      }
      else current_orders.push(order);
    }

    return { current_orders, past_orders };
  }

  async function getUserAppointments(params) {
    const { id } = params;

    const appointments = Appointment.findAll({
      attributes: ["id", "appointment_fee", "patient_name", "platform_fee", "appointment_date", "appointment_time", "appointment_progress"],
      include: [{
        model: Item,
        attributes: ["name"]
      }],
      where: { customer_id: id }
    })

    return appointments;
  }

  async function addCustomer(params) {
    // sequelizeCon.sync({ force: true });
    const { name, email, password, contact, address_details, lat, lng } =
      params;
    const count = await User.count({ where: { email: email } });
    if (count > 0) return { code: 200, msg: "Email already exists!" };
    const pass = await encryption.hashPassword(password, config);

    const user = await User.create({
      name: name,
      email,
      password: pass,
      contact,
    });

    if (user) await CustomerAddress.create({
      address_details, lat, lng, customerId: user.id
    })

    return user.id;
  }

  async function quickAddCustomer(params) {
    const { name, contact, address_details, city_id } =
      params;
    const count = await User.count({ where: { contact: contact } });
    if (count > 0) return { code: 200, msg: "User already exists!" };

    const password = Math.random().toString(36).slice(2, 10);
    const pass = await encryption.hashPassword(password, config);

    const user = await User.create({
      name: name,
      password: pass,
      contact,
      city_id
    });

    if (user) await CustomerAddress.create({
      address_details, customerId: user.id
    })
    return user.id;
  }

  async function updateCustomer(params, data) {
    const { name, email, contact, address_details, lat, lng, city_id } = data;

    const user = await User.update(
      {
        name: name,
        contact,
        email,
        city_id,
        status: 1,
      },
      {
        where: {
          id: params.id,
        },
      }
    );

    if (user) await CustomerAddress.update({ address_details, lat, lng },
      { where: { customerId: params.id } });

    return user;
  }

  async function updatePassword(params, body) {
    const { id } = params;
    const { curr_password, new_password } = body;
    const curr_pass = encryption.hashPassword(curr_password, config);

    const userPass = await User.findOne({
      where: {
        password: curr_pass,
        id
      }
    })

    if (!userPass) Boom.conflict("Current password is incorrect!");
    const pass = encryption.hashPassword(new_password, config);
    const user = await User.update(
      { password: pass },
      { where: { id } }
    )
    return { code: 200, reply: user }
  }

  async function deleteCustomerByID(params) {
    const user = await User.update(
      {
        status: 0,
      },
      {
        where: {
          id: params.id,
        },
      }
    );
    return user;
  }

  return {
    getCustomers,
    getCustomerAddress,
    getCustomerByID,
    getUserOrders,
    getUserAppointments,
    addCustomer,
    quickAddCustomer,
    updatePassword,
    updateCustomer,
    deleteCustomerByID,
  };
};
