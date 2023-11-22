module.exports = function svcCategory(opts) {
  const { mdlCategory, cloudinary } = opts;
  const { Category } = mdlCategory;

  async function getCategories(params) {
    const categories = await Category.findAll({
      attributes: ["id", "name", "display_title", "description", "image_url"],
      where: {
        status: 1
      }
    });
    return categories;
  }

  async function getCategoryByID(params) {
    const category = await Category.findOne({
      attributes: ["id", "name", "display_title", "description", "image_url"],
      where: {
        id: params.id,
      },
    });
    return category;
  }

  async function addCategory(params) {
    const { image_url } = params;
    delete params["image_url"];
    if (image_url) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      params["image_url"] = secure_url;
    }

    const category = await Category.create(params);
    return category;
  }

  async function updateCategory(params, data) {
    const { image_url } = data;
    if (image_url?.length > 200) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      data["image_url"] = secure_url;
    }
    const category = await Category.update(
      data,
      {
        where: {
          id: params.id,
        },
      }
    );

    return category;
  }

  async function deleteCategoryByID(params) {
    const category = await Category.update({
      status: 0
    },
      {
        where: {
          id: params.id,
        },

      });
    return category
  }

  return {
    getCategories,
    getCategoryByID,
    addCategory,
    updateCategory,
    deleteCategoryByID
  };
};
