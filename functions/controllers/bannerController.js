module.exports = function bannerController(opts) {
    const { svcBanner } = opts;

    async function getBanners(request, reply) {
        const records = await svcBanner.getBanners(request.params);
        reply.send({ code: 200, reply: records });
    }

    async function addBanner(request, reply) {
        const record = await svcBanner.addBanner(request.body);
        reply.send({ code: 200, reply: record });
    }

    async function deleteBannerByID(request, reply) {
        const record = await svcBanner.deleteBannerByID(request.params);
        reply.send({ code: 200, reply: record });
    }

    return { getBanners, addBanner, deleteBannerByID };
};
