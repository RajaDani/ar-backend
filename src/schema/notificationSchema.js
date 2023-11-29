module.exports = function notificationSchema(opts) {
    const { notificationController, Joi } = opts;

    const send = ({ fastify }) => {
        return {
            method: "POST",
            url: "/notification/send",
            schema: {
                body: Joi.object().keys({
                    title: Joi.string().required(),
                    msg: Joi.string().required()
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: notificationController.sendNotification,
        };
    };

    return { send };
};
