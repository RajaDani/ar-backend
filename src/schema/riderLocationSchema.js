module.exports = function riderLocationSchema(opts) {
  const { riderLocationController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/riders/location/read",
      handler: riderLocationController.getLocation,
    };
  };
  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/rider/location/update",
      schema: {
        body: Joi.object().keys({
          rider_id: Joi.number().required(),
          lat: Joi.number().required(),
          lng: Joi.number().required(),
        }),
      },

      handler: riderLocationController.updateLocation,
    };
  };
  return { add, read };
};
