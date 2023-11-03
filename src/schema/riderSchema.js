module.exports = function riderSchema(opts) {
  const { riderController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/rider/read",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: riderController.getRiders,
    };
  };

  const readByID = ({ fastify }) => {
    return {
      method: "GET",
      url: "/rider/read/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: riderController.getRiderByID,
    };
  };

  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/rider/add",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
          address: Joi.string().required(),
          image_url: Joi.string().allow(null, ""),
          contact: Joi.number().allow(null, ""),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: riderController.addRider,
    };
  };

  const update = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/rider/update/:id",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().required(),
          address: Joi.string().required(),
          image_url: Joi.string().allow(null, ""),
          contact: Joi.number().allow(null, ""),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: riderController.updateRider,
    };
  };

  const deleteByID = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/rider/delete/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: riderController.deleteRiderByID,
    };
  };

  return { read, readByID, add, update, deleteByID };
};
