module.exports = function orderController(opts) {
  const { svcOrder } = opts;

  async function getOrders(request, reply) {
    const records = await svcOrder.getOrders(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getOrderByID(request, reply) {
    const record = await svcOrder.getOrderByID(request.params);
    reply.send({ code: 200, reply: record });
  }
  async function getOrdersByBusiness(request, reply) {
    const record = await svcOrder.getOrdersByBusiness(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function searchOrders(request, reply) {
    const record = await svcOrder.searchOrders(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function addOrder(request, reply) {
    const record = await svcOrder.addOrder(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function updateOrder(request, reply) {
    const { params, body } = request;
    const record = await svcOrder.updateOrder(params, body);
    reply.send({ code: 200, reply: record });
  }

  async function quickUpdateOrder(request, reply) {
    const { params, body } = request;
    const record = await svcOrder.quickUpdateOrder(params, body);
    reply.send({ code: 200, reply: record });
  }

  async function deleteOrderByID(request, reply) {
    const record = await svcOrder.deleteOrderByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  return {
    getOrders,
    getOrderByID,
    searchOrders,
    addOrder,
    updateOrder,
    quickUpdateOrder,
    deleteOrderByID,
    getOrdersByBusiness,
  };
};
