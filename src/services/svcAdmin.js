module.exports = function svcAdmin(opts) {
  const { sequelizeCon, mdlAdmin, encryption, config } = opts;
  const { Admin } = mdlAdmin;

  async function getAdmins(params) {
    //   Admin.sync({ force: true });
    const admins = await Admin.findAll({
      attributes: ["id", "name", "email", "contact", "status"],
      where: {
        status: 1,
      },
    });
    return admins;
  }

  async function getAdminByID(params) {
    const admin = await Admin.findOne({
      attributes: ["id", "name", "email", "contact", "admin_type", "modules"],
      where: {
        id: params.id,
      },
    });
    return admin;
  }

  async function addAdmin(params, identity) {
    const {
      name,
      email,
      password,
      contact,
      modules,
      admin_type,
    } = params;

    if (identity.admin_type !== 1) return "You are not Super Admin!";
    const count = await Admin.count({ where: { email: email } });
    if (count > 0) return "Email already exists!";

    const pass = encryption.hashPassword(password, config);
    const token = await encryption.generateToken(params);
    if (token) {
      const admin = await Admin.create({
        name,
        email,
        password: pass,
        contact,
        admin_type,
        admin_creator_id: identity.id,
        modules,
      });

      if (admin) return token;
    }
  }

  async function updateAdmin(params, data, identity) {
    if (identity.admin_type !== 1) return "You are not Super Admin!";
    const admin = await Admin.update(
      data,
      {
        where: {
          id: params.id,
        },
      }
    );

    return admin;
  }

  async function deleteAdmin(params) {
    const admin = await Admin.update(
      {
        status: 0,
      },
      {
        where: {
          id: params.id,
        },
      }
    );
    return admin;
  }

  return {
    getAdmins,
    getAdminByID,
    addAdmin,
    updateAdmin,
    deleteAdmin,
  };
};
