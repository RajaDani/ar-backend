module.exports = function couponSchema(opts) {
    const { couponController, Joi } = opts;

    const read = ({ fastify }) => {
        return {
            method: "GET",
            url: "/coupon/read",
            handler: couponController.getCoupons,
        };
    };

    const readByID = ({ fastify }) => {
        return {
            method: "GET",
            url: "/coupon/read/:id",
            handler: couponController.getCouponByID,
        };
    };

    const validateCoupon = ({ fastify }) => {
        return {
            method: "GET",
            url: "/coupon/apply/:code",
            handler: couponController.validateCoupon,
        };
    };

    const add = ({ fastify }) => {
        return {
            method: "POST",
            url: "/coupon/add",
            schema: {
                body: Joi.object().keys({
                    name: Joi.string().required(),
                    description: Joi.string().allow(null, ""),
                    coupon_code: Joi.string().required(),
                    discount: Joi.number().allow(null, ""),
                    max_usage: Joi.number().required(),
                    end_date: Joi.string().required(),
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: couponController.addCoupon,
        };
    };

    const update = ({ fastify }) => {
        return {
            method: "PUT",
            url: "/coupon/update/:id",
            schema: {
                body: Joi.object().keys({
                    name: Joi.string().required(),
                    description: Joi.string().allow(null, ""),
                    coupon_code: Joi.string().required(),
                    discount: Joi.number().allow(null, ""),
                    max_usage: Joi.number().required(),
                    end_date: Joi.string().required(),
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: couponController.updateCoupon,
        };
    };

    return { read, readByID, validateCoupon, add, update };
};
