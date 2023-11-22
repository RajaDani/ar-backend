module.exports = function svcItem(opts) {
  const { sequelizeCon, mdlItem, mdlSubcategory, mdlBusiness, cloudinary, Op } =
    opts;
  const { Item } = mdlItem;
  const { Business } = mdlBusiness;
  const { Subcategory } = mdlSubcategory;

  async function getItems(params) {
    const items = await Item.findAll({
      attributes: [
        "id",
        "name",
        "image_url",
        "price",
        "old_price",
        "variation_data",
        "item_type",
        "rating",
        "featured",
      ],
      where: {
        status: 1,
      },
      include: [
        {
          model: Business,
          attributes: ["name"],
        },
        {
          model: Subcategory,
          attributes: ["name"],
        },
      ],
    });
    let stringify = JSON.stringify(items);
    let itemData = JSON.parse(stringify);
    const updatedData = itemData.map((x) => {
      const { business, subcategory } = x;
      delete x["business"];
      delete x["subcategory"];
      x["business"] = business?.name;
      x["subcategory"] = subcategory?.name;

      return x;
    });
    return updatedData;
  }

  async function getItemsFeatured(params) {
    const items = await Item.findAll({
      attributes: [
        "id",
        "name",
        "item_type",
        "variation_data",
        "image_url",
        "price",
        "old_price",
        "rating",
        "featured",
      ],
      where: {
        status: 1,
        featured: 1,
      },
      include: [
        {
          model: Business,
          attributes: ["id", "name"],
        },
        {
          model: Subcategory,
          attributes: ["name"],
        },
      ],
    });
    return items;
  }

  async function getItemsBySubcategory(params) {
    const { subCategoryId } = params;
    const items = await Item.findAll({
      attributes: [
        "id",
        "name",
        "image_url",
        "price",
        "old_price",
        "item_type",
        "variation_data",
        "rating",
        "featured",
      ],
      where: {
        status: 1,
        subcategory_id: subCategoryId,
      },
    });
    return items;
  }

  async function getItemsBySubcategoryAndBusiness(params) {
    const { subCategoryId, businessId } = params;
    const items = await Item.findAll({
      attributes: [
        "id",
        "name",
        "image_url",
        "price",
        "old_price",
        "rating",
        "featured",
        "item_type",
        "variation_data",
      ],
      where: {
        status: 1,
        subcategory_id: subCategoryId,
        business_id: businessId,
      },
    });
    return items;
  }

  async function getItemByID(params) {
    const item = await Item.findOne({
      where: {
        id: params.id,
      },
      include: [
        {
          model: Business,
          attributes: ["id", "name"],
        },
        {
          model: Subcategory,
          attributes: ["name"],
        },
      ],
    });

    let updatedData = item;
    let variation_data = updatedData.variation_data;
    if (variation_data) {
      let data = JSON.parse(variation_data);
      updatedData["variation_data"] = data;
    }

    return updatedData;
  }

  async function getItemsByBusiness(params) {
    const { businessId } = params;
    const item = await Item.findAll({
      attributes: [
        "id",
        "name",
        "price",
        "image_url",
        "description",
        "item_type",
        "variation_data",
        "rating",
      ],
      where: {
        business_id: businessId,
      },
      include: [
        {
          model: Subcategory,
          attributes: ["id", "name", "image_url"],
        },
        {
          model: Business,
          attributes: ["id", "name"],
        },
      ],
    });
    return item;
  }

  async function searchItemsByName(params) {
    const { name } = params;
    if (!name) return [];
    const item = await Item.findAll({
      attributes: [
        "id",
        "name",
        "price",
        "description",
        "image_url",
        "featured",
        "item_type",
        "rating",
        "variation_data",
      ],
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
        status: 1,
      },
      include: [
        {
          model: Business,
          attributes: [
            "id",
            "name",
            "rating",
            "image_url",
            "start_time",
            "end_time",
          ],
        },
        {
          model: Subcategory,
          attributes: ["id", "name"],
        },
      ],
    });
    return item;
  }

  async function featureItem(params) {
    const { id, value } = params;
    const item = await Item.update({ featured: value }, { where: { id } });
    return item;
  }

  async function searchItemByBusiness(params) {
    const { name, businessId } = params;
    if (!name) return [];
    const item = await Item.findAll({
      attributes: ["id", "name", "price", "description", "rating"],
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
        business_id: businessId,
      },
    });
    return item;
  }

  async function bulkAddItem(params) {
    const { data } = params;
    const item = await Item.bulkCreate(data);
    return item;
  }

  async function addItem(params) {
    const { image_url } = params;
    delete params["image_url"];
    if (image_url) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      params["image_url"] = secure_url;
    }

    const item = await Item.create(params);
    return item.id;
  }

  async function updateItem(params, data) {
    const { image_url } = data;
    if (image_url?.length > 200) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      data["image_url"] = secure_url;
    }
    const item = await Item.update(data, {
      where: {
        id: params.id,
      },
    });

    return { code: 200, msg: item };
  }

  async function deleteItemByID(params) {
    const item = await Item.update(
      {
        status: 0,
      },
      {
        where: {
          id: params.id,
        },
      }
    );
    return item;
  }

  return {
    getItems,
    getItemByID,
    getItemsByBusiness,
    getItemsBySubcategory,
    getItemsBySubcategoryAndBusiness,
    getItemsFeatured,
    searchItemsByName,
    featureItem,
    searchItemByBusiness,
    bulkAddItem,
    addItem,
    updateItem,
    deleteItemByID,
  };
};
