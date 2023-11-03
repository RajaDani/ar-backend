module.exports = function userSchema(opts) {
  const { authController, Joi } = opts;

  const login = ({ fastify }) => {
    return {
      method: "POST",
      url: "/user/login",
      schema: {
        body: Joi.object().keys({
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
      handler: authController.verifyUser,
    };
  };

  const signup = ({ fastify }) => {
    return {
      method: "POST",
      url: "/user/signup",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
          contact: Joi.number().allow(null, ""),
          address_details: Joi.string().allow(""),
          lat: Joi.number().allow(null, ""),
          lng: Joi.number().allow(null, ""),
        }),
      },
      handler: authController.createUser,
    };
  };

  const loginAdmin = ({ fastify }) => {
    return {
      method: "POST",
      url: "/admin/login",
      schema: {
        body: Joi.object().keys({
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
      handler: authController.verifyAdmin,
    };
  };



  return {
    login,
    signup,
    loginAdmin,
  };
};
