module.exports = function areaController(opts) {
    const { svcArea } = opts;

    async function getAreas(request, reply) {
        const records = await svcArea.getAreas(request.params);
        reply.send({ code: 200, reply: records });
    }

    async function getAreaByID(request, reply) {
        const records = await svcArea.getAreaByID(request.params);
        reply.send({ code: 200, reply: records });
    }

    async function getAreaByCity(request, reply) {
        const records = await svcArea.getAreaByCity(request.params);
        reply.send({ code: 200, reply: records });
    }

    async function addArea(request, reply) {
        const record = await svcArea.addArea(request.body);
        reply.send({ code: 200, reply: record });
    }

    async function updateArea(request, reply) {
        const { params, body } = request;
        const record = await svcArea.updateArea(params, body);
        reply.send({ code: 200, reply: record });
    }
    async function deleteAreaByID(request, reply) {
        const record = await svcArea.deleteAreaByID(request.params);
        reply.send({ code: 200, reply: record });
    }

    return { getAreas, getAreaByID, getAreaByCity, addArea, updateArea, deleteAreaByID };
};
