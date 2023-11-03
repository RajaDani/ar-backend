module.exports = function userSchema(opts) {
  const { userController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/customer/read",
      handler: userController.getCustomers,
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
    };
  };

  const readAddress = ({ fastify }) => {
    return {
      method: "GET",
      url: "/customer/read/address/:customerId",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: userController.getCustomerAddress,
    };
  };

  const readByID = ({ fastify }) => {
    return {
      method: "GET",
      url: "/customer/read/:id",
      handler: userController.getCustomerByID,
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
    };
  };

  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/customer/add",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
          contact: Joi.number().required(),
          address_details: Joi.string().required(),
          lat: Joi.number().optional().allow(null, ""),
          lng: Joi.number().optional().allow(null, ""),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: userController.addCustomer,
    };
  };

  const quickAdd = ({ fastify }) => {
    return {
      method: "POST",
      url: "/customer/add/quick",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          contact: Joi.number().required(),
          address_details: Joi.string().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: userController.quickAddCustomer,
    };
  };

  const update = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/customer/update/:id",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().optional().required(),
          contact: Joi.number().required(),
          address_details: Joi.string().optional().allow(""),
          lat: Joi.number().optional().allow(null, ""),
          lng: Joi.number().optional().allow(null, ""),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: userController.updateCustomer,
    };
  };

  const deleteByID = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/customer/delete/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: userController.deleteCustomerByID,
    };
  };

  return { read, readAddress, readByID, add, quickAdd, update, deleteByID };
};
