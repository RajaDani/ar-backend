module.exports = function adminDashboardController(opts) {
    const { svcAdminDashboard } = opts;

    async function getDashboardAnalytics(request, reply) {
        const records = await svcAdminDashboard.getDashboardAnalytics();
        reply.send({ code: 200, reply: records });
    }

    async function getOrdersByCity(request, reply) {
        const records = await svcAdminDashboard.getOrdersByCity();
        reply.send({ code: 200, reply: records });
    }

    async function getOrdersByWeek(request, reply) {
        const record = await svcAdminDashboard.getOrdersByWeek();
        reply.send({ code: 200, reply: record });
    }

    async function getLatestTransactions(request, reply) {
        const record = await svcAdminDashboard.getLatestTransactions();
        reply.send({ code: 200, reply: record });
    }

    async function getMemberships(request, reply) {
        const record = await svcAdminDashboard.getMemberships();
        reply.send({ code: 200, reply: record });
    }

    async function updateMembership(request, reply) {
        const record = await svcAdminDashboard.updateMembership(request.params, request.body);
        reply.send({ code: 200, reply: record });
    }

    return {
        getDashboardAnalytics, getOrdersByCity, getOrdersByWeek,
        getLatestTransactions, getMemberships, updateMembership
    };
};
