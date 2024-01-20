module.exports = function svcDcPercentage(opts) {
  const { sequelizeCon, mdlDcPercentage } = opts;
  const { DCPercentage } = mdlDcPercentage;

  async function getDC(params) {
    const dc = await DCPercentage.findAll({
      attributes: ["id", "from", "to", "percentage"],
    });
    return dc;
  }

  async function updateDC(params) {
    const { id, percentage } = params;
    const dc = await DCPercentage.update(
      { percentage },
      { where: { id } }
    );
    return dc;
  }
  return {
    getDC,
    updateDC,
  };
};
