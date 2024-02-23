module.exports = function riderFcmController(opts) {
  const { svcRiderFcm } = opts;

  async function getFcm(request, reply) {
    const records = await svcRiderFcm.getFcm(request.params);
    reply.send({ code: 200, reply: records });
  }
  async function addFcm(request, reply) {
    const record = await svcRiderFcm.addFcm(request.body);
    reply.send({ code: 200, reply: record });
  }
  return { getFcm, addFcm };
};
