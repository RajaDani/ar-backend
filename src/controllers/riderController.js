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

  async function addRider(request, reply) {
    const record = await svcRider.addRider(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function updateRider(request, reply) {
    const { params, body, identity } = request;
    const record = await svcRider.updateRider(params, body, identity);
    reply.send({ code: 200, reply: record });
  }

  async function deleteRiderByID(request, reply) {
    const record = await svcRider.deleteRiderByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  return { getRiders, getRiderByID, addRider, updateRider, deleteRiderByID };
};
