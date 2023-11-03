module.exports = function subCategorySchema(opts) {
  const { subCategoryController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/subcategory/read",
      handler: subCategoryController.getSubCategories,
    };
  };

  const readByCategory = ({ fastify }) => {
    return {
      method: "GET",
      url: "/subcategory/readByCategory/:categoryId",
      handler: subCategoryController.getSubCategoriesByCategory,
    };
  };

  const readByBusiness = ({ fastify }) => {
    return {
      method: "GET",
      url: "/subcategory/readByBusiness/:businessId",
      handler: subCategoryController.getSubCategoriesByBusiness,
    };
  };

  const readByID = ({ fastify }) => {
    return {
      method: "GET",
      url: "/subcategory/read/:id",
      handler: subCategoryController.getSubCategoryByID,
    };
  };

  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/subcategory/add",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          description: Joi.string().allow(null, ""),
          image_url: Joi.string().allow(null, ""),
          category_id: Joi.number().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: subCategoryController.addSubCategory,
    };
  };

  const update = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/subcategory/update/:id",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          description: Joi.string().allow(null, ""),
          image_url: Joi.string().allow(null, ""),
          category_id: Joi.number().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: subCategoryController.updateSubCategory,
    };
  };

  const deleteByID = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/subcategory/delete/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: subCategoryController.deleteSubCategoryByID,
    };
  };

  return { read, readByCategory, readByBusiness, readByID, add, update, deleteByID };
};
