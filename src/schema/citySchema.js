module.exports = function citySchema(opts) {
  const { cityController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/city/read",
      handler: cityController.getCities,
    };
  };

  const readByID = ({ fastify }) => {
    return {
      method: "GET",
      url: "/city/read/:id",
      handler: cityController.getCityByID,
    };
  };

  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/city/add",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          contact: Joi.number().allow(null, ""),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: cityController.addCity,
    };
  };

  const update = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/city/update/:id",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          contact: Joi.number().allow(null, ""),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: cityController.updateCity,
    };
  };

  const deleteByID = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/city/delete/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: cityController.deleteCityByID,
    };
  };

  return { read, readByID, add, update, deleteByID };
};
