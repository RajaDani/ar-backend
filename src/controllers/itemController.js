module.exports = function itemController(opts) {
  const { svcItem } = opts;

  async function getItems(request, reply) {
    const records = await svcItem.getItems(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getHiddenItems(request, reply) {
    const records = await svcItem.getHiddenItems(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getItemsFeatured(request, reply) {
    const records = await svcItem.getItemsFeatured(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getItemsBySubcategory(request, reply) {
    const records = await svcItem.getItemsBySubcategory(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getItemsByBusiness(request, reply) {
    const records = await svcItem.getItemsByBusiness(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getItemsBySubcategoryAndBusiness(request, reply) {
    const records = await svcItem.getItemsBySubcategoryAndBusiness(
      request.params
    );
    reply.send({ code: 200, reply: records });
  }

  async function getItemByID(request, reply) {
    const record = await svcItem.getItemByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function searchItemsByName(request, reply) {
    const record = await svcItem.searchItemsByName(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function featureItem(request, reply) {
    const record = await svcItem.featureItem(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function searchItemByBusiness(request, reply) {
    const record = await svcItem.searchItemByBusiness(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function bulkAddItem(request, reply) {
    const record = await svcItem.bulkAddItem(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function addItem(request, reply) {
    const record = await svcItem.addItem(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function updateItem(request, reply) {
    const { params, body } = request;
    const record = await svcItem.updateItem(params, body);
    reply.send({ code: 200, reply: record });
  }
  async function updateItemDiscount(request, reply) {
    const { body } = request;
    const record = await svcItem.updateItemDiscount(body);
    reply.send({ code: 200, reply: record });
  }

  async function deleteItemByID(request, reply) {
    const record = await svcItem.deleteItemByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  return {
    getItems,
    getHiddenItems,
    getItemsFeatured,
    getItemsBySubcategory,
    getItemsByBusiness,
    getItemsBySubcategoryAndBusiness,
    getItemByID,
    searchItemsByName,
    featureItem,
    searchItemByBusiness,
    bulkAddItem,
    addItem,
    updateItem,
    deleteItemByID,
    updateItemDiscount,
  };
};
