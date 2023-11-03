module.exports = function svcCity(opts) {
  const { sequelizeCon, mdlCity } = opts;
  const { City } = mdlCity;

  async function getCities(params) {
    // sequelizeCon.sync({ force: true });
    const cities = await City.findAll({
      attributes: ["id", "name", "contact", "status"],
      where: {
        status: 1
      }
    });
    return cities;
  }

  async function getCityByID(params) {
    const city = await City.findOne({
      attributes: ["id", "name", "contact"],
      where: {
        id: params.id,
      },
    });
    return city
  }

  async function addCity(params) {
    const city = await City.create(params);
    return city.id;
  }

  async function updateCity(params, data) {
    const city = await City.update(
      data,
      {
        where: {
          id: params.id,
        },
      }
    );

    return { code: 200, msg: city };
  }

  async function deleteCityByID(params) {
    const city = await City.update({
      status: 0
    },
      {
        where: {
          id: params.id,
        },

      });
    return city
  }

  return {
    getCities,
    getCityByID,
    addCity,
    updateCity,
    deleteCityByID
  };
};
