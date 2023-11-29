module.exports = function riderLocatonController(opts) {
  const { svcRiderLocation } = opts;

  async function getLocation(request, reply) {
    const records = await svcRiderLocation.getLocation(request.params);
    reply.send({ code: 200, reply: records });
  }
  async function updateLocation(request, reply) {
    const records = await svcRiderLocation.updateLocation(request.body);
    reply.send({ code: 200, reply: records });
  }
  return { updateLocation, getLocation };
};
