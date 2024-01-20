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

  const getUserOrders = ({ fastify }) => {
    return {
      method: "GET",
      url: "/customer/read/orders/:id",
      handler: userController.getUserOrders,
      preHandler: async (request, reply) => {
        await fastify.verifyToken(request, reply);
      },
    };
  };

  const getUserAppointments = ({ fastify }) => {
    return {
      method: "GET",
      url: "/customer/read/appointments/:id",
      handler: userController.getUserAppointments,
      preHandler: async (request, reply) => {
        await fastify.verifyToken(request, reply);
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
          city_id: Joi.number().required(),
          bachat_card_holder: Joi.boolean().optional(),
          student_card_holder: Joi.boolean().optional(),
          card_expiry: Joi.number().optional(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: userController.addCustomer,
    };
  };

  const addAddress = ({ fastify }) => {
    return {
      method: "POST",
      url: "/customer/add/address",
      schema: {
        body: Joi.object().keys({
          address_details: Joi.string().required(),
          customerId: Joi.number().required(),
          lat: Joi.number().optional().allow(null, ""),
          lng: Joi.number().optional().allow(null, ""),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: userController.addCustomerAddress,
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
          city_id: Joi.number().required(),
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
          city_id: Joi.number().required(),
          bachat_card_holder: Joi.boolean().optional(),
          student_card_holder: Joi.boolean().optional(),
          card_expiry: Joi.number().optional(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: userController.updateCustomer,
    };
  };

  const updatePassword = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/customer/update/password/:id",
      schema: {
        body: Joi.object().keys({
          curr_password: Joi.string().required(),
          new_password: Joi.string().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyToken(request, reply);
      },
      handler: userController.updatePassword,
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

  return {
    read, readAddress, readByID, getUserOrders,
    getUserAppointments, add, addAddress, quickAdd, update, updatePassword, deleteByID
  };
};
