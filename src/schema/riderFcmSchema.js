module.exports = function riderFcmSchema(opts) {
  const { riderFcmController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/rider/fcm/read/:rider_id",
      handler: riderFcmController.getFcm,
    };
  };

  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/rider/fcm/add",
      schema: {
        body: Joi.object().keys({
          rider_id: Joi.number().required(),
          token: Joi.string().required(),
        }),
      },
      handler: riderFcmController.addFcm,
    };
  };

  return { read, add };
};
