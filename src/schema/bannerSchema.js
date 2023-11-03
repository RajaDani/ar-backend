module.exports = function bannerSchema(opts) {
    const { bannerController, Joi } = opts;

    const read = ({ fastify }) => {
        return {
            method: "GET",
            url: "/banner/read",
            handler: bannerController.getBanners,
        };
    };

    const add = ({ fastify }) => {
        return {
            method: "POST",
            url: "/banner/add",
            schema: {
                body: Joi.object().keys({
                    title: Joi.string().required(),
                    description: Joi.string().allow(null, ""),
                    image_url: Joi.string().allow(null, ""),
                    type: Joi.number().allow(null),
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: bannerController.addBanner,
        };
    };

    const deleteByID = ({ fastify }) => {
        return {
            method: "DELETE",
            url: "/banner/delete/:id",
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: bannerController.deleteBannerByID,
        };
    };

    return { read, deleteByID, add };
};
