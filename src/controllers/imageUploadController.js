module.exports = function imageUploadController(opts) {
    const { svcImageUpload } = opts;

    async function uploadImage(request, reply) {
        const records = await svcImageUpload.uploadImage(request.body);
        reply.send({ code: 200, reply: records });
    }

    return { uploadImage };
};
