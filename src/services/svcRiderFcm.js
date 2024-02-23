module.exports = function svcRiderFcm(opts) {
  const { sequelizeCon, mdlRiderFcm } = opts;
  const { Rider_Fcm } = mdlRiderFcm;

  async function getFcm(params) {
    // FCM.sync({ force: true });
    const { rider_id } = params;
    const fcm_tokens = await Rider_Fcm.findAll({
      attributes: ["id", "token"],
      where: { rider_id },
    });
    return fcm_tokens;
  }

  async function addFcm(body) {
    const [fcm, created] = await Rider_Fcm.findOrCreate({
      where: body,
    });
    if (created) {
      return fcm.id;
    }
  }

  return {
    getFcm,
    addFcm,
  };
};
