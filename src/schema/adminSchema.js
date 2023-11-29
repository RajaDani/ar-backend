module.exports = function adminSchema(opts) {
  const { adminController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/admin/read",
      // preHandler: async (request, reply) => {
      //   await fastify.verifyAdminToken(request, reply);
      // },
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

  return { read, readByID, add, update, remove };
};
