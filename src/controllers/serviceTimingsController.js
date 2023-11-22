module.exports = function serviceTimingsController(opts) {
    const { svcServiceTimings } = opts;

    async function getServiceTimings(request, reply) {
        const records = await svcServiceTimings.getServiceTimings(request.params);
        reply.send({ code: 200, reply: records });
    }

    async function updateServiceAvailability(request, reply) {
        const { params } = request;
        const record = await svcServiceTimings.updateServiceAvailability(params);
        reply.send({ code: 200, reply: record });
    }

    return { getServiceTimings, updateServiceAvailability };
};
