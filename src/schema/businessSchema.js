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

  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/business/add",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().allow(null, ""),
          contact: Joi.number().required(),
          address: Joi.string().required(),
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
          rating: Joi.number().allow(null, ""),
          start_time: Joi.string().required(),
          end_time: Joi.string().required(),
          availability: Joi.boolean().required(),
          image_url: Joi.string().allow(null, ""),
          city_id: Joi.number().required(),
          category_id: Joi.number().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: businessController.addBusiness,
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
          rating: Joi.number().allow(null, ""),
          start_time: Joi.string().required(),
          end_time: Joi.string().required(),
          availability: Joi.boolean().required(),
          image_url: Joi.string().allow(null, ""),
          city_id: Joi.number().required(),
          category_id: Joi.number().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: businessController.updateBusiness,
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

  return { read, readByID, readFeatured, add, update, readByCategory, readBySubCategory, deleteByID };
};
