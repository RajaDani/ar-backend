module.exports = function authController(opts) {
  const { svcAuth } = opts;

  async function verifyUser(req, reply) {
    const record = await svcAuth.verifyUser(req.body);
    reply.send({ code: 200, reply: record });
  }

  async function verifyAdmin(req, reply) {
    const record = await svcAuth.verifyAdmin(req.body);
    reply.send({ code: 200, reply: record });
  }

  async function createUser(req, reply) {
    const record = await svcAuth.createUser(req.body);
    reply.send({ code: 200, reply: record });
  }

  async function createAdmin(req, reply) {
    const record = await svcAuth.createAdmin(req.body);
    reply.send({ code: 200, reply: record });
  }

  return {
    verifyUser,
    createUser,
    verifyAdmin,
    createAdmin,
  };
};
