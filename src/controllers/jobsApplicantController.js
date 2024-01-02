module.exports = function jobsApplicantController(opts) {
  const { svcjobsApplicant } = opts;

  async function addApplication(request, reply) {
    const record = await svcjobsApplicant.addApplication(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function getApplications(request, reply) {
    const record = await svcjobsApplicant.getApplications();
    reply.send({ code: 200, reply: record });
  }

  async function removeApplication(request, reply) {
    const record = await svcjobsApplicant.removeApplication(request.params);
    reply.send({ code: 200, reply: record });
  }

  return { addApplication, getApplications, removeApplication };
};
