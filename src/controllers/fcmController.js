module.exports = function fcmController(opts) {
  const { svcFcm } = opts;

  async function getFcm(request, reply) {
    const records = await svcFcm.getFcm(request.params);
    reply.send({ code: 200, reply: records });
  }
  async function addFcm(request, reply) {
    const record = await svcFcm.addFcm(request.body);
    reply.send({ code: 200, reply: record });
  }
  return { getFcm, addFcm };
};
