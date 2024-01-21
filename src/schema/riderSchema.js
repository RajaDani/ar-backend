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

  const readRiderStats = ({ fastify }) => {
    return {
      method: "GET",
      url: "/rider/read/stats/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: riderController.getRiderStats,
    };
  };

  const readIndividualRidersOrders = ({ fastify }) => {
    return {
      method: "GET",
      url: "/rider/read/order/single",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: riderController.getIndividualRidersOrders,
    };
  };

  const readReviews = ({ fastify }) => {
    return {
      method: "GET",
      url: "/rider/read/reviews",
      handler: riderController.getRiderReviews,
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
          city_id: Joi.number().required(),
          job_type: Joi.string().required(),
          job_start_time: Joi.string().required(),
          job_end_time: Joi.string().required(),
          off_days: Joi.string().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: riderController.addRider,
    };
  };

  const addRiderBill = ({ fastify }) => {
    return {
      method: "POST",
      url: "/rider/add/bill",
      schema: {
        body: Joi.object().keys({
          image: Joi.string().required(),
          bill_date: Joi.string().required(),
          total_amount: Joi.number().required(),
          bill_id: Joi.string().allow(null, ""),
          bill_date: Joi.string().required(),
          rider_id: Joi.number().required(),
          business_id: Joi.number().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyRiderToken(request, reply);
      },
      handler: riderController.addRiderBills,
    };
  };

  const addRiderReview = ({ fastify }) => {
    return {
      method: "POST",
      url: "/rider/add/review",
      schema: {
        body: Joi.object().keys({
          title: Joi.string().required(),
          description: Joi.string().allow(null, ""),
          rating: Joi.number().required(),
          customer_id: Joi.number().required(),
          order_id: Joi.number().required(),
          rider_id: Joi.number().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyToken(request, reply);
      },
      handler: riderController.addRiderReview,
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
          city_id: Joi.number().required(),
          job_type: Joi.string().required(),
          job_start_time: Joi.string().required(),
          job_end_time: Joi.string().required(),
          off_days: Joi.string().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: riderController.updateRider,
    };
  };

  const updateRiderStatus = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/rider/update/status/:id",
      schema: {
        params: Joi.object().keys({
          id: Joi.number().required(),
        }),
        body: Joi.object().keys({
          rider_job_start: Joi.number().optional().allow(null, ""),
          rider_job_end: Joi.number().optional().allow(null, ""),
          rider_job_status: Joi.boolean().optional().allow(null, ""),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyRiderToken(request, reply);
      },
      handler: riderController.updateRiderStatus,
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

  const deleteReviewByID = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/rider/delete/review/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: riderController.deleteRiderReview,
    };
  };

  const getRiderOrders = ({ fastify }) => {
    return {
      method: "GET",
      url: "/rider/read/orders/:id",
      handler: riderController.getRiderOrders,
      preHandler: async (request, reply) => {
        await fastify.verifyRiderToken(request, reply);
      },
    };
  };

  return {
    read,
    readByID,
    readIndividualRidersOrders,
    readRiderStats,
    readReviews,
    add,
    addRiderReview,
    addRiderBill,
    update,
    updateRiderStatus,
    deleteByID,
    deleteReviewByID,
    getRiderOrders,
  };
};
