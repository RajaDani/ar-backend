module.exports = function cityController(opts) {
  const { svcCity } = opts;

  async function getCities(request, reply) {
    const records = await svcCity.getCities(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getCityByID(request, reply) {
    const record = await svcCity.getCityByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function addCity(request, reply) {
    const record = await svcCity.addCity(request.body);
    reply.send({ code: 200, reply: record });
  }

  async function updateCity(request, reply) {
    const { params, body } = request;
    const record = await svcCity.updateCity(params, body);
    reply.send({ code: 200, reply: record });
  }

  async function deleteCityByID(request, reply) {
    const record = await svcCity.deleteCityByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  return { getCities, getCityByID, addCity, updateCity, deleteCityByID };
};
