module.exports = function membershipSchema(opts) {
    const { membershipController, Joi } = opts;

    const read = ({ fastify }) => {
        return {
            method: "GET",
            url: "/membership/read",
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: membershipController.getMemberships,
        };
    };

    const add = ({ fastify }) => {
        return {
            method: "POST",
            url: "/membership/add",
            schema: {
                body: Joi.object().keys({
                    card_type: Joi.string().required(),
                    payment_method: Joi.string().required(),
                    card_status: Joi.string().optional(),
                    address_1: Joi.string().required(),
                    address_2: Joi.string().allow(null, ""),
                    user_id: Joi.number().required(),
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyToken(request, reply);
            },
            handler: membershipController.addMembership,
        };
    };

    const update = ({ fastify }) => {
        return {
            method: "PUT",
            url: "/membership/update/:id/:user_id",
            schema: {
                body: Joi.object().keys({
                    card_status: Joi.string().required(),
                    card_type: Joi.string().required(),
                    address_1: Joi.string().required(),
                    address_2: Joi.string().allow(null, ""),
                    card_expiry: Joi.string().required(),
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyToken(request, reply);
            },
            handler: membershipController.updateMembership,
        };
    };

    return { read, add, update };
};
