module.exports = function svcAuth(opts) {
  const { sequelize, mdlUser, mdlAdmin, encryption, config, mdlCustomerAddress } = opts;
  const { User } = mdlUser;
  const { Admin } = mdlAdmin;
  const { CustomerAddress } = mdlCustomerAddress;

  async function createUser(params) {
    const { name, email, password, contact, address_details, lat, lng } = params;
    User.sync();
    const count = await User.count({ where: { email: email } });
    if (count > 0) return { code: 200, msg: "Email already exists!" };
    const pass = encryption.hashPassword(password, config);
    const token = await encryption.generateToken(params);
    if (token) {
      const user = await User.create({
        name,
        email,
        pass,
        contact,
      });
      if (user) await CustomerAddress.create({
        address_details, lat, lng, customerId: user.id
      })

      if (user) return { msg: "success", token };
    }
  }

  async function createAdmin(params) {
    const { name, email, password, contact, address_details, modules } = params;
    const count = await Admin.count({ where: { email: email } });
    if (count > 0) return { code: 200, msg: "Email already exists!" };
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
    try {
      const user = await User.findOne({
        where: {
          email: email,
          password: pass,
        },
      });
      if (!user) return { msg: "Incorrect username or password!" };

      const token = await encryption.generateToken(user);
      if (token)
        return {
          msg: "success",
          token,
          name: user.name,
          email: user.email,
          contact: user.contact,
        };
    } catch (error) {
      return { code: 500, msg: "Something went wrong" };
    }
  }

  async function verifyAdmin(params) {
    const { email, password } = params;
    const pass = await encryption.hashPassword(password, config);

    try {
      const admin = await Admin.findOne({
        where: {
          email,
          password: pass,
        },
      });
      if (!admin) return { msg: "Incorrect username or password!" };

      const token = await encryption.generateAdminToken(admin);
      if (token) {
        const data = {
          adminToken: token,
          name: admin.name,
          email: admin.email,
          modules: admin.modules,
          contact: admin.contact,
          admin_type: admin.admin_type
        };
        return { msg: "success", data };
      }
    } catch (error) {
      return { code: 500, msg: "Something went wrong" };
    }
  }

  return {
    createUser,
    verifyUser,
    verifyAdmin,
    createAdmin,
  };
};
