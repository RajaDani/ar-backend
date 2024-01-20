module.exports = function itemSchema(opts) {
  const { itemController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/item/read",
      handler: itemController.getItems,
    };
  };

  const readHiddenItems = ({ fastify }) => {
    return {
      method: "GET",
      url: "/item/read/hidden",
      handler: itemController.getHiddenItems,
    };
  };

  const readFeaturedItems = ({ fastify }) => {
    return {
      method: "GET",
      url: "/item/read/featured/:categoryId",
      handler: itemController.getItemsFeatured,
    };
  };

  const readBySubcategory = ({ fastify }) => {
    return {
      method: "GET",
      url: "/item/read/subcategory/:subCategoryId",
      handler: itemController.getItemsBySubcategory,
    };
  };

  const readByID = ({ fastify }) => {
    return {
      method: "GET",
      url: "/item/read/:id",
      handler: itemController.getItemByID,
    };
  };

  const readByBusiness = ({ fastify }) => {
    return {
      method: "GET",
      url: "/item/read/business/:businessId",
      handler: itemController.getItemsByBusiness,
    };
  };

  const readByBusinessAndSubCategory = ({ fastify }) => {
    return {
      method: "GET",
      url: "/item/read/business/:businessId/:subCategoryId",
      handler: itemController.getItemsBySubcategoryAndBusiness,
    };
  };

  const searchItem = ({ fastify }) => {
    return {
      method: "GET",
      url: "/item/search/:name",
      handler: itemController.searchItemsByName,
    };
  };

  const featureItem = ({ fastify }) => {
    return {
      method: "GET",
      url: "/item/featured/:id/:value",
      handler: itemController.featureItem,
    };
  };

  const searchItemByBusiness = ({ fastify }) => {
    return {
      method: "GET",
      url: "/item/search/:businessId/:name",
      handler: itemController.searchItemByBusiness,
    };
  };

  const bulkAdd = ({ fastify }) => {
    return {
      method: "POST",
      url: "/item/add/bulk",
      schema: {
        body: Joi.object().keys({
          data: Joi.array().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: itemController.bulkAddItem,
    };
  };

  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/item/add",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          description: Joi.string().allow(null, ""),
          price: Joi.number().required(),
          old_price: Joi.number().allow(null, ""),
          online_fee: Joi.number().required(),
          rating: Joi.number().required(),
          item_type: Joi.string().required(),
          image_url: Joi.string().allow(null, ""),
          featured: Joi.boolean(),
          variation_data: Joi.array().allow(null),
          service_start_time: Joi.string().allow(null, ""),
          service_end_time: Joi.string().allow(null, ""),
          service_online_start_time: Joi.string().allow(null, ""),
          service_online_end_time: Joi.string().allow(null, ""),
          business_id: Joi.number().required(),
          subcategory_id: Joi.number().required(),
          created_by: Joi.string().optional().allow("", null),
          updated_by: Joi.string().optional().allow("", null),
          student_card_discount: Joi.number().optional().allow(null, ""),
          bachat_card_discount: Joi.number().optional().allow(null, ""),
          status: Joi.boolean(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: itemController.addItem,
    };
  };

  const update = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/item/update/:id",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          description: Joi.string().optional().allow(null, ""),
          price: Joi.number().required(),
          old_price: Joi.number().allow(null, ""),
          online_fee: Joi.number().optional().allow(null, ""),
          rating: Joi.number().required(),
          item_type: Joi.string().optional(),
          image_url: Joi.string().optional().allow(null, ""),
          featured: Joi.boolean(),
          variation_data: Joi.array().optional().allow(null),
          service_start_time: Joi.string().optional().allow(null, ""),
          service_end_time: Joi.string().optional().allow(null, ""),
          service_online_start_time: Joi.string().optional().allow(null, ""),
          service_online_end_time: Joi.string().optional().allow(null, ""),
          business_id: Joi.number().optional(),
          subcategory_id: Joi.number().optional(),
          created_by: Joi.string().optional().allow("", null),
          updated_by: Joi.string().optional().allow("", null),
          student_card_discount: Joi.number().optional().allow(null, ""),
          bachat_card_discount: Joi.number().optional().allow(null, ""),
          status: Joi.boolean(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: itemController.updateItem,
    };
  };
  const updateItemDiscount = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/item/discount/update",
      schema: {
        body: Joi.object().keys({
          card: Joi.string().required(),
          itemsIds: Joi.array().required(),
          percentage: Joi.number().required(),
          businessId: Joi.number().required(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: itemController.updateItemDiscount,
    };
  };
  const deleteByID = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/item/delete/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: itemController.deleteItemByID,
    };
  };

  return {
    read,
    readHiddenItems,
    readFeaturedItems,
    searchItem,
    readByBusiness,
    searchItemByBusiness,
    readByBusinessAndSubCategory,
    readBySubcategory,
    readByID,
    featureItem,
    bulkAdd,
    add,
    update,
    deleteByID,
    updateItemDiscount,
  };
};
