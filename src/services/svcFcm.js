module.exports = function svcCity(opts) {
  const { sequelizeCon, mdlFcm } = opts;
  const { FCM } = mdlFcm;

  async function getFcm(params) {
    // FCM.sync({ force: true });
    const fcm_tokens = await FCM.findAll({
      attributes: ["id", "token", "role"],
    });
    return fcm_tokens;
  }

  async function addFcm(body) {
    const fcm = await FCM.create(body);
    return fcm;
  }
  return {
    getFcm,
    addFcm,
  };
};
