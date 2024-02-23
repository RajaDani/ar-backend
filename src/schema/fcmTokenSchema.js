const { allow } = require("joi");

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
          role: Joi.string().required(),
          token: Joi.string().required(),
          user_id: Joi.number().optional().allow(null, ""),
          admin_id: Joi.number().optional().allow(null, ""),
        }),
      },
      handler: fcmController.addFcm,
    };
  };

  return { read, add };
};
