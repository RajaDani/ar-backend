module.exports = function userSchema(opts) {
  const { authController, Joi } = opts;

  const login = ({ fastify }) => {
    return {
      method: "POST",
      url: "/user/login",
      schema: {
        body: Joi.object().keys({
          contact: Joi.number().required(),
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
          lat: Joi.number().optional().allow(null, ""),
          lng: Joi.number().optional().allow(null, ""),
          city_id: Joi.number().required(),
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

  const loginRider = ({ fastify }) => {
    return {
      method: "POST",
      url: "/rider/login",
      schema: {
        body: Joi.object().keys({
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
      handler: authController.verifyRider,
    };
  };

  const loginBusiness = ({ fastify }) => {
    return {
      method: "POST",
      url: "/business/login",
      schema: {
        body: Joi.object().keys({
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
      handler: authController.verifyBusiness,
    };
  };
  return {
    login,
    signup,
    loginAdmin,
    loginRider,
    loginBusiness,
  };
};
