module.exports = function membershipController(opts) {
    const { svcMembership } = opts;

    async function getMemberships(request, reply) {
        const records = await svcMembership.getMemberships(request.params);
        reply.send({ code: 200, reply: records });
    }

    async function addMembership(request, reply) {
        const records = await svcMembership.addMembership(request.body);
        reply.send({ code: 200, reply: records });
    }

    async function updateMembership(request, reply) {
        const records = await svcMembership.updateMembership(request.params, request.body);
        reply.send({ code: 200, reply: records });
    }

    return { getMemberships, addMembership, updateMembership };
};
