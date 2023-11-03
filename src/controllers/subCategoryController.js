module.exports = function subcategoryController(opts) {
  const { svcSubCategory } = opts;

  async function getSubCategories(request, reply) {
    const records = await svcSubCategory.getSubCategories(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getSubCategoriesByCategory(request, reply) {
    const records = await svcSubCategory.getSubCategoriesByCategory(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getSubCategoriesByBusiness(request, reply) {
    const records = await svcSubCategory.getSubCategoriesByBusiness(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getSubCategoryByID(request, reply) {
    const record = await svcSubCategory.getSubCategoryByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function addSubCategory(request, reply) {
    const record = await svcSubCategory.addSubCategory(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function updateSubCategory(request, reply) {
    const { params, body } = request;
    const record = await svcSubCategory.updateSubCategory(params, body);
    reply.send({ code: 200, reply: record });
  }

  async function deleteSubCategoryByID(request, reply) {
    const record = await svcSubCategory.deleteSubCategoryByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  return {
    getSubCategories,
    getSubCategoriesByCategory,
    getSubCategoriesByBusiness,
    getSubCategoryByID,
    addSubCategory,
    updateSubCategory,
    deleteSubCategoryByID,
  };
};
