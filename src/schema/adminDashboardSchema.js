module.exports = function adminDashboardSchema(opts) {
    const { adminDashboardController, Joi } = opts;

    const readAnaltics = ({ fastify }) => {
        return {
            method: "GET",
            url: "/admin/dashboard/analytics",
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: adminDashboardController.getDashboardAnalytics,
        };
    };

    const readOrdersByCity = ({ fastify }) => {
        return {
            method: "GET",
            url: "/admin/dashboard/orders/city",
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: adminDashboardController.getOrdersByCity,
        };
    };

    const getOrdersByWeek = ({ fastify }) => {
        return {
            method: "GET",
            url: "/admin/dashboard/orders/weekly",
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: adminDashboardController.getOrdersByWeek,
        };
    };

    const getLatestTransactions = ({ fastify }) => {
        return {
            method: "GET",
            url: "/admin/dashboard/orders/recent",
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: adminDashboardController.getLatestTransactions,
        };
    };

    return {
        readAnaltics,
        readOrdersByCity,
        getOrdersByWeek,
        getLatestTransactions
    };
};

