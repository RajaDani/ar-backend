module.exports = function jobTypesSchema(opts) {
    const { jobTypesController, Joi } = opts;

    const add = ({ fastify }) => {
        return {
            method: "POST",
            url: "/job-type/add",
            schema: {
                body: Joi.object().keys({
                    name: Joi.string().required(),
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: jobTypesController.addJobType,
        };
    };

    const read = ({ fastify }) => {
        return {
            method: "GET",
            url: "/job-type/read",
            handler: jobTypesController.getJobTypes,
        };
    };

    return { add, read };
};
