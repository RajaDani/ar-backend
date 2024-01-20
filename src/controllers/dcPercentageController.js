
module.exports = function dcPercentageController(opts) {
  const { svcDcPercentage } = opts;

  async function getDC(request, reply) {
    const records = await svcDcPercentage.getDC(request.params);
    reply.send({ code: 200, reply: records });
  }
  async function updateDC(request, reply) {
    const record = await svcDcPercentage.updateDC(request.params);
    reply.send({ code: 200, reply: record });
  }
  return { getDC, updateDC };
};
