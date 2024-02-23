module.exports = function svcAdmin(opts) {
  const { sequelizeCon, mdlAdmin, encryption, config, mdlRiderBills, mdlBusiness, mdlRider, mdlUserMembership, mdlUser } = opts;
  const { Admin } = mdlAdmin;
  const { RiderBills } = mdlRiderBills;
  const { Rider } = mdlRider;
  const { Business } = mdlBusiness;
  const { UserMembership } = mdlUserMembership;
  const { User } = mdlUser;

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

  async function getRiderBills(params) {
    const { business_id, rider_id, bill_date } = params;
    if (!business_id) delete params["business_id"];
    if (!rider_id) delete params["rider_id"];
    if (!bill_date) delete params["bill_date"];
    params["status"] = 1;

    const bills = await RiderBills.findAll({
      attributes: ["id", "image", "bill_date", "total_amount", "bill_id", "createdAt"],
      include: [{
        model: Business,
        attributes: ["name"]
      },
      {
        model: Rider,
        attributes: ["name"]
      }
      ],
      where: params
    });
    return bills;
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

  async function deleteBill(params) {
    const bill = await RiderBills.update(
      {
        status: 0,
      },
      {
        where: {
          id: params.id,
        },
      }
    );
    return bill;
  }

  return {
    getAdmins,
    getAdminByID,
    getRiderBills,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    deleteBill
  };
};
