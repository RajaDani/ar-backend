module.exports = function svcCity(opts) {
  const { sequelizeCon, mdlFcm } = opts;
  const { FCM } = mdlFcm;

  async function getFcm(params) {
    // FCM.sync({ force: true });
    const fcm_tokens = await FCM.findAll();
    return fcm_tokens;
  }

  // async function addFcm(body) {
  //   const { token, role } = body;
  //   const count = await FCM.count({ where: { token } });
  //   if (count > 0) return;
  //   const fcm = await FCM.create(body);
  //   return fcm;
  // }
  async function addFcm(body) {
    const { token, role, user_id } = body;
    const existingFcm = await FCM.findOne({ where: { token } });
    if (existingFcm) {
      if (!existingFcm.user_id && user_id) {
        await existingFcm.update({ user_id });
        return existingFcm;
      } else return null;
    } else {
      const fcm = await FCM.create(body);
      return fcm;
    }
  }

  return {
    getFcm,
    addFcm,
  };
};
