module.exports = function jobsApplicantSchema(opts) {
  const { jobsApplicantController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/job/application/read",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: jobsApplicantController.getApplications,
    };
  };


  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/job/application/add",
      schema: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().required(),
          cnic: Joi.number().required(),
          image_url: Joi.string().required(),
          contact: Joi.number().required(),
          job_type: Joi.string().required(),
        }),
      },

      handler: jobsApplicantController.addApplication,
    };
  };

  const remove = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/job/application/remove/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: jobsApplicantController.removeApplication,
    };
  };

  return {
    read,
    add,
    remove
  };
};
