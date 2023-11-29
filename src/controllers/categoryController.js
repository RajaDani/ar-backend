module.exports = function categoryController(opts) {
  const { svcCategory } = opts;

  async function getCategories(request, reply) {
    const records = await svcCategory.getCategories(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getCategoryByID(request, reply) {
    const records = await svcCategory.getCategoryByID(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function addCategory(request, reply) {
    const record = await svcCategory.addCategory(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function updateCategory(request, reply) {
    const { params, body } = request;
    const record = await svcCategory.updateCategory(params, body);
    reply.send({ code: 200, reply: record });
  }

  async function deleteCategoryByID(request, reply) {
    const record = await svcCategory.deleteCategoryByID(request.params);
    reply.send({ code: 200, reply: record });
  }
  async function searchCategory(request, reply) {
    const record = await svcCategory.searchCategory(request.params);
    reply.send({ code: 200, reply: record });
  }

  return {
    getCategories,
    getCategoryByID,
    addCategory,
    updateCategory,
    deleteCategoryByID,
    searchCategory,
  };
};
