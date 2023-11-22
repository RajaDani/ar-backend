module.exports = function serviceTimingsSchema(opts) {
    const { serviceTimingsController, Joi } = opts;

    const readTimings = ({ fastify }) => {
        return {
            method: "GET",
            url: "/service/read/timings",
            handler: serviceTimingsController.getServiceTimings,
        };
    };

    const updateAvailability = ({ fastify }) => {
        return {
            method: "GET",
            url: "/service/update/availability/:value",
            handler: serviceTimingsController.updateServiceAvailability,
        };
    };

    return {
        readTimings,
        updateAvailability
    };
};

