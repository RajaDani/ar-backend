module.exports = function businessController(opts) {
  const { svcBusiness } = opts;

  async function getBusinesses(request, reply) {
    const records = await svcBusiness.getBusinesses(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getBusinessByCategory(request, reply) {
    const records = await svcBusiness.getBusinessByCategory(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getBusinessBySubCategory(request, reply) {
    const records = await svcBusiness.getBusinessBySubCategory(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getBusinessReviews(request, reply) {
    const record = await svcBusiness.getBusinessReviews();
    reply.send({ code: 200, reply: record });
  }

  async function getBusinessByID(request, reply) {
    const records = await svcBusiness.getBusinessByID(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getFeaturedBusiness(request, reply) {
    const records = await svcBusiness.getFeaturedBusiness(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function addBusiness(request, reply) {
    const record = await svcBusiness.addBusiness(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function joinBusinessRequest(request, reply) {
    const record = await svcBusiness.joinBusinessRequest(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function addBusinessReview(request, reply) {
    const record = await svcBusiness.addBusinessReview(request.body);
    reply.send({ code: 200, reply: record });
  }
  async function readBusinessReview(request, reply) {
    const record = await svcBusiness.readBusinessReview(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function updateBusiness(request, reply) {
    const { params, body } = request;
    const record = await svcBusiness.updateBusiness(params, body);
    reply.send({ code: 200, reply: record });
  }

  async function QuickUpdate(request, reply) {
    const { params, body } = request;
    const record = await svcBusiness.QuickUpdate(params, body);
    reply.send({ code: 200, reply: record });
  }
  async function deleteBusinessReview(request, reply) {
    const record = await svcBusiness.deleteBusinessReview(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function deleteBusinessByID(request, reply) {
    const record = await svcBusiness.deleteBusinessByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function searchBusiness(request, reply) {
    const record = await svcBusiness.searchBusiness(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function searchBusinessByCategory(request, reply) {
    const record = await svcBusiness.searchBusinessByCategory(request.params);
    reply.send({ code: 200, reply: record });
  }

  return {
    getBusinesses,
    getBusinessByID,
    getFeaturedBusiness,
    getBusinessReviews,
    addBusiness,
    addBusinessReview,
    updateBusiness,
    getBusinessByCategory,
    getBusinessBySubCategory,
    deleteBusinessByID,
    searchBusiness,
    searchBusinessByCategory,
    deleteBusinessReview,
    readBusinessReview,
    joinBusinessRequest,
    QuickUpdate,
  };
};
