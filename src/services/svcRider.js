module.exports = function svcRider(opts) {
  const { sequelizeCon, mdlRider, config, encryption, cloudinary, mdlCity } = opts;
  const { Rider } = mdlRider;
  const { City } = mdlCity;

  async function getRiders(params) {
    // sequelizeCon.sync({ force: true });
    const riders = await Rider.findAll({
      attributes: ["id", "name", "email", "contact", "address", "image_url", "status"],
      where: {
        status: 1
      },
      include: [{
        model: City,
        attributes: ["id", "name"]
      }]
    });
    return riders;
  }

  async function getRiderByID(params) {
    const rider = await Rider.findOne({
      attributes: ["id", "name", "email", "contact", "address", "image_url"],
      include: [{
        model: City,
        attributes: ["name"]
      }],
      where: {
        id: params.id,
      },
    });
    return rider
  }

  async function addRider(params) {
    const { image_url, password } = params;
    delete params["image_url"];
    delete params["password"];
    const pass = await encryption.hashPassword(password, config);
    params["password"] = pass;

    if (image_url) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      params["image_url"] = secure_url;
    }
    const rider = await Rider.create(params);

    return rider.id;
  }

  async function updateRider(params, data, identity) {
    const { image_url } = data;
    const { id } = identity;
    data["admin_id"] = id;

    if (image_url?.length > 200) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      data["image_url"] = secure_url;
    }
    const rider = await Rider.update(
      data,
      {
        where: {
          id: params.id,
        },
      }
    );

    return rider;
  }

  async function deleteRiderByID(params) {
    const rider = await Rider.update({
      status: 0
    },
      {
        where: {
          id: params.id,
        },

      });
    return rider
  }

  return {
    getRiders,
    getRiderByID,
    addRider,
    updateRider,
    deleteRiderByID
  };
};
