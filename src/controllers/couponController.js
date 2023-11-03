module.exports = function couponController(opts) {
    const { svcCoupon } = opts;

    async function getCoupons(request, reply) {
        const records = await svcCoupon.getCoupons(request.params);
        reply.send({ code: 200, reply: records });
    }

    async function getCouponByID(request, reply) {
        const records = await svcCoupon.getCouponByID(request.params);
        reply.send({ code: 200, reply: records });
    }

    async function validateCoupon(request, reply) {
        const records = await svcCoupon.validateCoupon(request.params);
        reply.send({ code: 200, reply: records });
    }

    async function addCoupon(request, reply) {
        const record = await svcCoupon.addCoupon(request.body);
        reply.send({ code: 200, reply: record });
    }

    async function updateCoupon(request, reply) {
        const { params, body } = request;
        const record = await svcCoupon.updateCoupon(params, body);
        reply.send({ code: 200, reply: record });
    }

    return { getCoupons, getCouponByID, validateCoupon, addCoupon, updateCoupon };
};
