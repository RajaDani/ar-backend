module.exports = function categorySchema(opts) {
  const { categoryController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/category/read",
      handler: categoryController.getCategories,
    };
  };

  const readByID = ({ fastify }) => {
    return {
      method: "GET",
      url: "/category/read/:id",
      handler: categoryController.getCategoryByID,
    };
  };

  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/category/add",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          description: Joi.string().allow(null, ""),
          image_url: Joi.string().allow(null, ""),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: categoryController.addCategory,
    };
  };

  const update = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/category/update/:id",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          description: Joi.string().allow(null, ""),
          image_url: Joi.string().allow(null, ""),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: categoryController.updateCategory,
    };
  };

  const deleteByID = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/category/delete/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: categoryController.deleteCategoryByID,
    };
  };

  return { read, readByID, add, update, deleteByID };
};
