module.exports = function svcUser(opts) {
  const { sequelizeCon, mdlUser, mdlCustomerAddress, encryption, config } =
    opts;
  const { User } = mdlUser;
  const { CustomerAddress } = mdlCustomerAddress;

  async function getCustomers(params) {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "contact", "status"],
      where: {
        status: 1,
      },
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
      }]
    });

    let response = {};
    if (user && user.customer_addresses.length > 0) {
      response = user.dataValues;
      let address = response.customer_addresses[0];
      delete response["customer_addresses"];
      response.address_details = address.address_details;
      response.lat = address.lat;
      response.lng = address.lng
    }

    return response;
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
    const { name, contact, address_details } =
      params;
    const count = await User.count({ where: { contact: contact } });
    if (count > 0) return { code: 200, msg: "User already exists!" };

    const password = Math.random().toString(36).slice(2, 10);
    const pass = await encryption.hashPassword(password, config);

    const user = await User.create({
      name: name,
      password: pass,
      contact,
    });

    if (user) await CustomerAddress.create({
      address_details, customerId: user.id
    })
    return user.id;
  }

  async function updateCustomer(params, data) {
    const { name, email, contact, address_details, lat, lng } = data;

    const user = await User.update(
      {
        name: name,
        contact,
        email,
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
    addCustomer,
    quickAddCustomer,
    updateCustomer,
    deleteCustomerByID,
  };
};
