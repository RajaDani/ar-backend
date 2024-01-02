module.exports = function adminSchema(opts) {
  const { adminController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/admin/read",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: adminController.getAdmins,
    };
  };

  const readByID = ({ fastify }) => {
    return {
      method: "GET",
      url: "/admin/read/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: adminController.getAdminByID,
    };
  };

  const getRiderBills = ({ fastify }) => {
    return {
      method: "POST",
      url: "/admin/read/bills",
      schema: {
        body: Joi.object().keys({
          business_id: Joi.number().allow(null, ""),
          rider_id: Joi.number().allow(null, ""),
          bill_date: Joi.string().allow(null, "")
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: adminController.getRiderBills,
    };
  };

  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/admin/create",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
          contact: Joi.number().allow(null, ""),
          admin_type: Joi.number().required(),
          modules: Joi.string().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: adminController.addAdmin,
    };
  };

  const update = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/admin/update/:id",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().required(),
          contact: Joi.number().allow(null, ""),
          admin_type: Joi.number().required(),
          modules: Joi.string().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: adminController.updateAdmin,
    };
  };

  const remove = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/admin/delete/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: adminController.deleteAdmin,
    };
  };

  const removeBill = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/admin/delete/bill/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: adminController.deleteBill,
    };
  };

  return { read, readByID, getRiderBills, add, update, remove, removeBill };
};
