module.exports = function DCPercentage(opts) {
  const { dcPercentageController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/dc/percentage/read",
      handler: dcPercentageController.getDC,
    };
  };

  const update = ({ fastify }) => {
    return {
      method: "GET",
      url: "/dc/percentage/update/:id/:percentage",
      handler: dcPercentageController.updateDC,
    };
  };

  return { read, update };
};
