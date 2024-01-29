module.exports = function businessSchema(opts) {
  const { businessController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/business/read",
      handler: businessController.getBusinesses,
    };
  };

  const readByCategory = ({ fastify }) => {
    return {
      method: "GET",
      url: "/category/business/read/:categoryId",
      handler: businessController.getBusinessByCategory,
    };
  };

  const readBySubCategory = ({ fastify }) => {
    return {
      method: "GET",
      url: "/subcategory/business/read/:subCategoryId",
      handler: businessController.getBusinessBySubCategory,
    };
  };

  const readByID = ({ fastify }) => {
    return {
      method: "GET",
      url: "/business/read/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: businessController.getBusinessByID,
    };
  };

  const readFeatured = ({ fastify }) => {
    return {
      method: "GET",
      url: "/business/read/featured",
      handler: businessController.getFeaturedBusiness,
    };
  };

  const readReviews = ({ fastify }) => {
    return {
      method: "GET",
      url: "/business/read/reviews",
      handler: businessController.getBusinessReviews,
    };
  };

  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/business/add",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().allow(null, ""),
          password: Joi.string().required(),
          contact: Joi.number().required(),
          address: Joi.string().required(),
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
          delivery_charges: Joi.number().required(),
          rating: Joi.number().allow(null, ""),
          start_time: Joi.string().required(),
          end_time: Joi.string().required(),
          availability: Joi.boolean().required(),
          image_url: Joi.string().allow(null, ""),
          city_id: Joi.number().required(),
          category_id: Joi.number().required(),
          location_side_id: Joi.number().required(),
          store_spec: Joi.string().allow(null, ""),
          off_days: Joi.string().allow(null, ""),
          in_city: Joi.boolean().required(),
          discount_alloted: Joi.boolean().optional(),
          youtube_link: Joi.string().allow(null, ""),
          ordering_num: Joi.number().allow(null, ""),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: businessController.addBusiness,
    };
  };

  const addBusinessReview = ({ fastify }) => {
    return {
      method: "POST",
      url: "/business/add/review",
      schema: {
        body: Joi.object().keys({
          title: Joi.string().required(),
          description: Joi.string().allow(null, ""),
          rating: Joi.number().required(),
          customer_id: Joi.number().required(),
          business_id: Joi.number().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyToken(request, reply);
      },
      handler: businessController.addBusinessReview,
    };
  };

  const joinBusinessRequest = ({ fastify }) => {
    return {
      method: "POST",
      url: "/business/join/request",
      schema: {
        body: Joi.object().keys({
          business_name: Joi.string().required(),
          business_owner_name: Joi.string().required(),
          address: Joi.string().required(),
          google_location: Joi.string().required(),
          business_category: Joi.string().required(),
          item_types: Joi.string().required(),
          contact_1: Joi.number().required(),
          contact_2: Joi.number().required(),
          business_timings: Joi.string().required(),
        }),
      },
      handler: businessController.joinBusinessRequest,
    };
  };

  const readBusinessReview = ({ fastify }) => {
    return {
      method: "GET",
      url: "/business/review/read/:business_id",
      handler: businessController.readBusinessReview,
    };
  };
  const update = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/business/update/:id",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().allow(null, ""),
          contact: Joi.number().required(),
          address: Joi.string().required(),
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
          delivery_charges: Joi.number().required(),
          rating: Joi.number().allow(null, ""),
          start_time: Joi.string().required(),
          end_time: Joi.string().required(),
          availability: Joi.boolean().required(),
          image_url: Joi.string().allow(null, ""),
          city_id: Joi.number().required(),
          category_id: Joi.number().required(),
          location_side_id: Joi.number().required(),
          store_spec: Joi.string().allow(null, ""),
          off_days: Joi.string().allow(null, ""),
          in_city: Joi.boolean().required(),
          discount_alloted: Joi.boolean().optional(),
          youtube_link: Joi.string().allow(null, ""),
          ordering_num: Joi.number().allow(null, ""),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: businessController.updateBusiness,
    };
  };
  const QuickUpdate = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/business/profile/update/:id",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          image_url: Joi.string().required(),
          email: Joi.string().allow(null, ""),
          contact: Joi.number().required(),
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyBusinessToken(request, reply);
      },
      handler: businessController.QuickUpdate,
    };
  };

  const deleteByID = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/business/delete/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: businessController.deleteBusinessByID,
    };
  };

  const deleteReviewByID = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/business/delete/review/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: businessController.deleteBusinessReview,
    };
  };

  const searchBusiness = ({ fastify }) => {
    return {
      method: "GET",
      url: "/business/search/:name",
      handler: businessController.searchBusiness,
    };
  };

  const searchBusinessByCategory = ({ fastify }) => {
    return {
      method: "GET",
      url: "/business/search/:categoryId/:name",
      handler: businessController.searchBusinessByCategory,
    };
  };

  return {
    read,
    readByID,
    readFeatured,
    readReviews,
    add,
    addBusinessReview,
    readBusinessReview,
    update,
    readByCategory,
    readBySubCategory,
    deleteByID,
    deleteReviewByID,
    searchBusiness,
    searchBusinessByCategory,
    joinBusinessRequest,
    QuickUpdate,
  };
};
