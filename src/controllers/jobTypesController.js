module.exports = function jobTypeController(opts) {
    const { svcJobTypes } = opts;

    async function addJobType(request, reply) {
        const records = await svcJobTypes.addJobType(request.body);
        reply.send({ code: 200, reply: records });
    }

    async function getJobTypes(request, reply) {
        const records = await svcJobTypes.getJobTypes(request.body);
        reply.send({ code: 200, reply: records });
    }

    return { addJobType, getJobTypes };
};
