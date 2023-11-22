module.exports = function imageUploadSchema(opts) {
    const { imageUploadController, Joi } = opts;

    const upload = ({ fastify }) => {
        return {
            method: "POST",
            url: "/image/upload",
            schema: {
                body: Joi.object().keys({
                    image: Joi.string().required(),
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: imageUploadController.uploadImage,
        };
    };

    return { upload };
};
