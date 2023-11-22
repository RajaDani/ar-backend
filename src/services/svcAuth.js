module.exports = function svcAuth(opts) {
  const {
    sequelize,
    mdlUser,
    mdlAdmin,
    encryption,
    config,
    Boom,
    mdlCustomerAddress,
  } = opts;
  const { User } = mdlUser;
  const { Admin } = mdlAdmin;
  const { CustomerAddress } = mdlCustomerAddress;

  async function createUser(params) {
    const { name, email, password, contact, address_details, lat, lng } =
      params;
    const emailCheck = await User.count({ where: { email } });
    if (emailCheck > 0) Boom.conflict("Email already exists!");
    const contactCheck = await User.count({ where: { contact } });
    if (contactCheck > 0) Boom.conflict("Contact already exists!");
    const pass = encryption.hashPassword(password, config);
    const token = await encryption.generateToken(params);
    if (token) {
      const user = await User.create({
        name,
        email,
        password: pass,
        contact,
      });
      if (user)
        await CustomerAddress.create({
          address_details,
          lat,
          lng,
          customerId: user.id,
        });

      if (user) return { msg: "success", token };
    }
  }

  async function createAdmin(params) {
    const { name, email, password, contact, address_details, modules } = params;
    const count = await Admin.count({ where: { email: email } });
    if (count > 0) Boom.conflict("Email already exists!");
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
    const { email, password } = params;
    const pass = encryption.hashPassword(password, config);

    const user = await User.findOne({
      where: {
        email: email,
        password: pass,
      },
      include: [{
        model: CustomerAddress,
        attributes: ["address_details"]
      }],
    });
    if (!user) throw Boom.conflict("Incorrect email or password")
    const token = await encryption.generateToken(user);
    if (token)
      return {
        msg: "success",
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        address: user.customer_addresses[0].address_details

      }

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
    if (!admin) Boom.conflict("Incorrect username or password!");

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
  };
};
