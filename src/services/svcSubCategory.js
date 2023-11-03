module.exports = function svcSubcategory(opts) {
  const { mdlSubcategory, cloudinary, mdlCategory, mdlBusinessCategory, mdlItem, sequelize, Op } = opts;
  const { Subcategory } = mdlSubcategory;
  const { Category } = mdlCategory;
  const { BusinessCategory } = mdlBusinessCategory;
  const { Item } = mdlItem;

  async function getSubCategories(params) {
    const subcategory = await Subcategory.findAll({
      attributes: ["id", "name", "description", "image_url"],
      where: {
        status: 1
      }
    });
    return subcategory;
  }

  async function getSubCategoriesByCategory(params) {
    const { categoryId } = params;
    const subcategory = await Subcategory.findAll({
      attributes: ["id", "name", "description", "image_url"],
      include: [{
        model: Category,
        attributes: []
      }],
      where: {
        status: 1,
        category_id: categoryId
      }
    });
    return subcategory;
  }


  async function getSubCategoriesByBusiness(params) {
    const { businessId } = params;
    const ids = await Item.findAll({
      attributes: [sequelize.fn('DISTINCT', sequelize.col('subcategory_id')), 'subcategory_id'],
      where: {
        business_id: businessId,
        status: 1
      },
      raw: true
    });

    const subcategoryIds = ids.map(item => item.subcategory_id);
    const businesses = await Subcategory.findAll({
      attributes: ["id", "name"],
      where: {
        status: 1,
        id: { [Op.in]: subcategoryIds }
      }
    })
    // const { category_id } = await BusinessCategory.findOne({
    //   where: {
    //     business_id: businessId
    //   }
    // })

    // const subCategories = await Subcategory.findAll({
    //   attributes: ['id', 'name', 'description'],
    //   where: {
    //     category_id
    //   }
    // })
    return businesses;
  }


  async function getSubCategoryByID(params) {
    const subcategory = await Subcategory.findOne({
      attributes: ['id', 'name', 'description', "image_url", "category_id"],
      where: {
        id: params.id,
      },
      include: [{
        model: Category,
        attributes: ["name"]
      }]
    });
    return subcategory;
  }

  async function addSubCategory(params) {
    const { image_url } = params;
    delete params["image_url"];
    if (image_url) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      params["image_url"] = secure_url;
    }

    const subcategory = await Subcategory.create(params);
    return subcategory;
  }

  async function updateSubCategory(params, data) {
    const { image_url } = data;
    if (image_url?.length > 200) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      data["image_url"] = secure_url;
    }
    const subcategory = await Subcategory.update(
      data,
      {
        where: {
          id: params.id,
        },
      }
    );

    return subcategory;
  }

  async function deleteSubCategoryByID(params) {
    const subCategory = await Subcategory.update({
      status: 0
    },
      {
        where: {
          id: params.id,
        },

      });
    return subCategory
  }

  return {
    getSubCategories,
    getSubCategoriesByCategory,
    getSubCategoriesByBusiness,
    getSubCategoryByID,
    addSubCategory,
    updateSubCategory,
    deleteSubCategoryByID
  };
};
