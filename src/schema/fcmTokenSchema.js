module.exports = function fcmSchema(opts) {
  const { fcmController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/fcm/read",
      handler: fcmController.getFcm,
    };
  };

  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/fcm/add",
      schema: {
        body: Joi.object().keys({
          token: Joi.string().required(),
        }),
      },
      handler: fcmController.addFcm,
    };
  };

  return { read, add };
};
