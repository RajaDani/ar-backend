module.exports = function svcImageUpload(opts) {
    const { cloudinary } = opts;

    async function uploadImage(body) {
        let image_url = "";
        if (body.image) {
            const { secure_url } = await cloudinary.v2.uploader.upload(body.image);
            image_url = secure_url;
        }

        return image_url;
    }

    return { uploadImage };
};
