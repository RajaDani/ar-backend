module.exports = function customerController(opts) {
  const { svcUser } = opts;

  async function getCustomers(request, reply) {
    const records = await svcUser.getCustomers(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getCustomerAddress(request, reply) {
    const records = await svcUser.getCustomerAddress(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getCustomerByID(request, reply) {
    const record = await svcUser.getCustomerByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function addCustomer(request, reply) {
    const record = await svcUser.addCustomer(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function quickAddCustomer(request, reply) {
    const record = await svcUser.quickAddCustomer(request.body);
    reply.send({ code: 200, reply: record });
  }


  async function updateCustomer(request, reply) {
    const { params, body } = request;
    const record = await svcUser.updateCustomer(params, body);
    reply.send({ code: 200, reply: record });
  }

  async function deleteCustomerByID(request, reply) {
    const record = await svcUser.deleteCustomerByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  return {
    getCustomers,
    getCustomerAddress,
    getCustomerByID,
    addCustomer,
    quickAddCustomer,
    updateCustomer,
    deleteCustomerByID,
  };
};
