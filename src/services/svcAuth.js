module.exports = function svcAuth(opts) {
  const {
    sequelize,
    mdlUser,
    mdlAdmin,
    encryption,
    config,
    Boom,
    mdlCustomerAddress,
    mdlRider,
  } = opts;
  const { User } = mdlUser;
  const { Rider } = mdlRider;

  const { Admin } = mdlAdmin;
  const { CustomerAddress } = mdlCustomerAddress;

  async function createUser(params) {
    const { name, email, password, contact, address_details, lat, lng, city_id } =
      params;
    const emailCheck = await User.count({ where: { email } });
    if (emailCheck > 0) throw Boom.conflict("Email already exists!");
    const contactCheck = await User.count({ where: { contact } });
    if (contactCheck > 0) throw Boom.conflict("Contact already exists!");
    const pass = encryption.hashPassword(password, config);
    const token = await encryption.generateToken(params);
    let userData = {};
    if (token) {
      const user = await User.create({
        name,
        email,
        password: pass,
        contact,
        city_id
      }).then((data) => userData = JSON.stringify(data));

      if (user)
        await CustomerAddress.create({
          address_details,
          lat,
          lng,
          customerId: user.id,
        });

      const parsedData = JSON.parse(userData);
      parsedData["token"] = token;
      delete parsedData["password"];
      delete parsedData["createdAt"];
      delete parsedData["updatedAt"];
      delete parsedData["status"];

      if (user) return {
        msg: "success", user: parsedData
      };
    }
  }

  async function createAdmin(params) {
    const { name, email, password, contact, address_details, modules } = params;
    const count = await Admin.count({ where: { email: email } });
    if (count > 0) throw Boom.conflict("Email already exists!");
    const pass = encryption.hashPassword(password, config);
    const token = await encryption.generateToken(params);
    if (token) {
      const admin = await Admin.create({
        name: name,
        email: email,
        password: pass,
        contact: contact,
        address: address_details,
        status: 1,
        modules,
      });

      if (admin) return { msg: "success", token };
    }
  }

  async function verifyUser(params) {
    const { contact, password } = params;
    const pass = encryption.hashPassword(password, config);

    const user = await User.findOne({
      where: {
        contact,
        password: pass,
      },
      include: [
        {
          model: CustomerAddress,
          attributes: ["address_details"],
        },
      ],
    });
    if (!user) throw Boom.conflict("Incorrect contact or password");
    const token = await encryption.generateToken(user);
    if (token)
      return {
        msg: "success",
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        address: user.customer_addresses[0].address_details,
      };
  }
  async function verifyRider(params) {
    const { email, password } = params;
    const pass = encryption.hashPassword(password, config);

    const rider = await Rider.findOne({
      where: {
        email: email,
        password: pass,
      },
      // include: [
      //   {
      //     model: CustomerAddress,
      //     attributes: ["address_details"],
      //   },
      // ],
    });
    if (!rider) throw Boom.conflict("Incorrect email or password");
    const token = await encryption.generateToken(rider);
    if (token)
      return {
        msg: "success",
        token,
        id: rider.id,
        name: rider.name,
        email: rider.email,
        contact: rider.contact,
        // address: Rider.customer_addresses[0].address_details,
      };
  }

  async function verifyAdmin(params) {
    const { email, password } = params;
    const pass = await encryption.hashPassword(password, config);
    const admin = await Admin.findOne({
      where: {
        email,
        password: pass,
      },
    });
    if (!admin) throw Boom.conflict("Incorrect username or password!");

    const token = await encryption.generateAdminToken(admin);
    if (token) {
      const data = {
        adminToken: token,
        name: admin.name,
        email: admin.email,
        modules: admin.modules,
        contact: admin.contact,
        admin_type: admin.admin_type,
      };
      return { msg: "success", data };
    }
  }

  return {
    createUser,
    verifyUser,
    verifyAdmin,
    createAdmin,
    verifyRider,
  };
};
