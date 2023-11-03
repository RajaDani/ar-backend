module.exports = function svcBanner(opts) {
    const { sequelizeCon, mdlBanner, config, encryption, cloudinary } = opts;
    const { Banner } = mdlBanner;

    async function getBanners(params) {
        const banners = await Banner.findAll({
            attributes: ["id", "title", "description", "image_url", "type"],
            where: {
                status: 1
            }
        });
        return banners;
    }

    async function addBanner(params) {
        const { image_url } = params;
        delete params["image_url"];
        if (image_url) {
            const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
            params["image_url"] = secure_url;
        }
        const banner = await Banner.create(params);
        return banner.id;
    }

    async function deleteBannerByID(params) {
        const banner = await Banner.update(
            { status: 0 },
            { where: { id: params.id } }
        );
        return banner
    }

    return {
        getBanners,
        addBanner,
        deleteBannerByID
    };
};
