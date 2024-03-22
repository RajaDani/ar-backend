module.exports = function svcUser(opts) {
  const {
    sequelizeCon,
    sequelize,
    mdlUser,
    mdlOrder,
    mdlItem,
    mdlAppointment,
    mdlCustomerAddress,
    encryption,
    config,
    mdlCity,
    Boom,
    Op,
    axios
  } = opts;
  const { User } = mdlUser;
  const { Order } = mdlOrder;
  const { CustomerAddress } = mdlCustomerAddress;
  const { Appointment } = mdlAppointment;
  const { Item } = mdlItem;
  const { City } = mdlCity;

  async function getCustomers(params) {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "contact",
        "status",
        "bachat_card_holder",
        "student_card_holder",
        "city_id"
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
    return users;
  }

  async function getCustomerAddress(params) {
    const { customerId } = params;
    const address = await CustomerAddress.findAll({
      attributes: ["id", "address_details"],
      include: [
        {
          model: User,
          where: { id: customerId },
          attributes: [],
        },
      ],
      where: {
        status: 1,
      },
    });
    return address;
  }

  async function getCustomerByID(params) {
    const user = await User.findOne({
      attributes: [
        "id",
        "name",
        "email",
        "contact",
        "city_id"
      ],
      where: {
        id: params.id,
      },
      include: [
        {
          model: CustomerAddress,
          attributes: ["address_details", "lat", "lng"],
          limit: 1,
        },
        {
          model: City,
          attributes: ["name"],
        },
      ],
    });

    const stringifyData = JSON.stringify(user);
    const filteredData = JSON.parse(stringifyData);

    filteredData["address_details"] =
      filteredData.customer_addresses[0]?.address_details;
    filteredData["lat"] = filteredData.customer_addresses[0]?.lat;
    filteredData["lng"] = filteredData.customer_addresses[0]?.lng;
    delete filteredData["customer_addresses"];

    return filteredData;
  }

  async function getUserOrders(params) {
    const { id } = params;

    const sql = `SELECT o.id,o.total,o.createdAt,o.progress_status,r.name AS rider_name,
          r.id AS rider_id,GROUP_CONCAT(oi.order_item_price) AS item_prices,GROUP_CONCAT(oi.order_item_quantity) AS item_quantity,
        GROUP_CONCAT(oi.item_id) AS item_ids,GROUP_CONCAT(it.name) AS item_names,
        GROUP_CONCAT(b.name) AS business_names 
        FROM orders AS o 
        LEFT JOIN order_items AS oi ON oi.order_id = o.id 
        LEFT JOIN items AS it ON it.id = oi.item_id 
        LEFT JOIN businesses AS b ON b.id = it.business_id 
        LEFT JOIN customers AS u ON u.id = o.customer_id 
        LEFT JOIN riders AS r ON r.id = o.rider_id 
        WHERE o.status = 1 AND o.customer_id =${id} GROUP BY o.id ORDER BY o.id DESC`;

    const orders = await sequelizeCon.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    let current_orders = [];
    let past_orders = [];

    for (let order of orders) {
      if (
        order.progress_status == "cancelled" ||
        order.progress_status == "delivered"
      ) {
        past_orders.push(order);
      } else current_orders.push(order);
    }

    return { current_orders, past_orders };
  }

  async function getUserAppointments(params) {
    const { id } = params;

    const appointments = Appointment.findAll({
      attributes: [
        "id",
        "appointment_fee",
        "app_holder_name",
        "platform_fee",
        "appointment_date",
        "appointment_time",
        "appointment_progress",
      ],
      include: [
        {
          model: Item,
          attributes: ["name"],
        },
      ],
      where: { customer_id: id },
    });

    return appointments;
  }

  async function addCustomer(params) {
    // sequelizeCon.sync({ force: true });
    const { email, password, address_details, lat, lng, contact } = params;
    delete params["address_details"];
    delete params["lat"];
    delete params["lng"];
    const count = await User.count({ where: { [Op.or]: [{ email }, { contact }] } });
    if (count > 0) throw Boom.conflict("Email or contact already exists!");
    const pass = await encryption.hashPassword(password, config);
    params["password"] = pass;

    const user = await User.create(params);

    if (user)
      await CustomerAddress.create({
        address_details,
        lat,
        lng,
        customerId: user.id,
      });

    return user.id;
  }

  async function addCustomerAddress(body) {
    const address = await CustomerAddress.create(body);
    return address;
  }

  async function quickAddCustomer(params) {
    const { name, contact, address_details, city_id } = params;
    const count = await User.count({ where: { contact: contact } });
    if (count > 0) throw Boom.conflict("Contact already exists!");

    const password = Math.random().toString(36).slice(2, 10);
    const pass = await encryption.hashPassword(password, config);

    const user = await User.create({
      name: name,
      password: pass,
      contact,
      city_id,
    });

    if (user)
      await CustomerAddress.create({
        address_details,
        customerId: user.id,
      });

    await sendTextMessage(contact, password);
    return user.id;
  }

  async function updateCustomer(params, data) {
    const {
      name,
      email,
      contact,
      address_details,
      lat,
      lng,
      city_id,
      bachat_card_holder,
      student_card_holder,
      card_expiry,
    } = data;
    const user = await User.update(
      {
        name: name,
        contact,
        email,
        city_id,
        bachat_card_holder,
        student_card_holder,
        status: 1,
        card_expiry,
      },
      {
        where: {
          id: params.id,
        },
      }
    );

    if (user)
      await CustomerAddress.update(
        { address_details, lat, lng },
        { where: { customerId: params.id } }
      );

    return user;
  }

  async function updateUserInfo(params, data) {
    if (data?.contact) {
      const count = await User.count({ where: { contact: data.contact } });
      if (count > 0) throw Boom.conflict("Contact already exists!");
    }

    const user = await User.update(data, { where: { id: params.id } });

    if (user)
      await CustomerAddress.update(
        { address_details: data.address_details },
        { where: { customerId: params.id } }
      );

    return user;
  }

  async function updatePassword(params, body) {
    const { id } = params;
    const { curr_password, new_password } = body;
    const curr_pass = encryption.hashPassword(curr_password, config);

    const userPass = await User.findOne({
      where: {
        password: curr_pass,
        id,
      },
    });

    if (!userPass) throw Boom.conflict("Current password is incorrect!");
    const pass = encryption.hashPassword(new_password, config);
    const user = await User.update({ password: pass }, { where: { id } });
    return { code: 200, reply: user };
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

  async function sendTextMessage(contact, password) {
    const msg = `Your account has been created successfully on AR Home Services.%0AHere are your credentials%0A` +
      `contact: ${contact}%0A` +
      `password:${password}%0A` +
      `Don't share your credentials with anyone.`;
    await axios.post(`https://secure.h3techs.com/sms/api/send?email=abdurrehman825@gmail.com&key=02760a2ab2a613810cc4e3150d576f2620&to=92${contact}&message=${msg}`)
  }


  return {
    getCustomers,
    getCustomerAddress,
    getCustomerByID,
    getUserOrders,
    getUserAppointments,
    addCustomer,
    addCustomerAddress,
    quickAddCustomer,
    updatePassword,
    updateCustomer,
    updateUserInfo,
    deleteCustomerByID,
  };
};
