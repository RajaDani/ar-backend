const { Op } = require("sequelize");
const sequelize = require("sequelize")
module.exports = function svcCoupon(opts) {
    const { mdlCoupon } = opts;
    const { Coupon } = mdlCoupon;

    async function getCoupons(params) {
        // sequelizeCon.sync({ force: true });
        const coupons = await Coupon.findAll({
            attributes: ["id", "name", "coupon_code", "discount", "max_usage", "end_date"],
            where: {
                status: 1
            }
        });
        return coupons;
    }

    async function getCouponByID(params) {
        const coupon = await Coupon.findOne({
            attributes: ["id", "name", "description", "coupon_code", "discount", "max_usage", "end_date"],
            where: {
                id: params.id,
            },
        });
        return coupon
    }

    async function addCoupon(params) {
        const { coupon_code } = params
        params["usage"] = 0;
        const count = await Coupon.count({ where: { coupon_code } });
        if (count > 0) return { code: 200, msg: "Coupon already exists!" };
        const coupon = await Coupon.create(params);
        return coupon.id;
    }

    async function validateCoupon(params) {
        const { code } = params;
        const date = new Date();
        const coupon = await Coupon.findOne({
            attributes: ["id", "discount"],

            where: {
                coupon_code: code,
                usage: {
                    [Op.lt]: sequelize.col('coupon.max_usage')
                },
                end_date: {
                    [Op.gt]: date
                }
            }
        });
        if (coupon) {
            await Coupon.update({
                usage: coupon.usage + 1
            },
                {
                    where: {
                        coupon_code: code,
                    }
                }
            )
        }
        return coupon;
    }

    async function updateCoupon(params, data) {
        const coupon = await Coupon.update(
            data,
            {
                where: {
                    id: params.id,
                },
            }
        );

        return { code: 200, msg: coupon };
    }

    async function deleteCouponByID(params) {
        const coupon = await Coupon.update({
            status: 0
        },
            {
                where: {
                    id: params.id,
                },

            });
        return coupon
    }

    return {
        getCoupons,
        getCouponByID,
        validateCoupon,
        addCoupon,
        updateCoupon,
        deleteCouponByID
    };
};
