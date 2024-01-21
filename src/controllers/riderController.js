module.exports = function riderController(opts) {
  const { svcRider } = opts;

  async function getRiders(request, reply) {
    const records = await svcRider.getRiders(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getRiderByID(request, reply) {
    const record = await svcRider.getRiderByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function getRiderStats(request, reply) {
    const record = await svcRider.getRiderStats(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function getIndividualRidersOrders(request, reply) {
    const record = await svcRider.getIndividualRidersOrders();
    reply.send({ code: 200, reply: record });
  }

  async function getRiderReviews(request, reply) {
    const record = await svcRider.getRiderReviews();
    reply.send({ code: 200, reply: record });
  }

  async function addRider(request, reply) {
    const { body, identity } = request;
    const record = await svcRider.addRider(body, identity);
    reply.send({ code: 200, reply: record });
  }

  async function addRiderReview(request, reply) {
    const record = await svcRider.addRiderReview(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function addRiderBills(request, reply) {
    const record = await svcRider.addRiderBills(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function updateRider(request, reply) {
    const { params, body, identity } = request;
    const record = await svcRider.updateRider(params, body, identity);
    reply.send({ code: 200, reply: record });
  }

  async function updateRiderStatus(request, reply) {
    const { params, body } = request;
    const record = await svcRider.updateRiderStatus(params, body);
    reply.send({ code: 200, reply: record });
  }

  async function deleteRiderReview(request, reply) {
    const record = await svcRider.deleteRiderReview(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function deleteRiderByID(request, reply) {
    const record = await svcRider.deleteRiderByID(request.params);
    reply.send({ code: 200, reply: record });
  }
  async function getRiderOrders(request, reply) {
    const record = await svcRider.getRiderOrders(request.params);
    reply.send({ code: 200, reply: record });
  }

  return {
    getRiders,
    getRiderByID,
    getRiderStats,
    getIndividualRidersOrders,
    getRiderReviews,
    addRider,
    addRiderReview,
    addRiderBills,
    updateRider,
    updateRiderStatus,
    deleteRiderByID,
    deleteRiderReview,
    getRiderOrders,
  };
};
