module.exports = function adminController(opts) {
  const { svcAdmin } = opts;

  async function getAdmins(request, reply) {
    const records = await svcAdmin.getAdmins(request.params);
    reply.send({ code: 200, reply: records });
  }

  async function getAdminByID(request, reply) {
    const record = await svcAdmin.getAdminByID(request.params);
    reply.send({ code: 200, reply: record });
  }

  async function addAdmin(request, reply) {
    const record = await svcAdmin.addAdmin(request.body, request.identity);
    reply.send({ code: 200, reply: record });
  }

  async function updateAdmin(request, reply) {
    const { params, body, identity } = request;
    const record = await svcAdmin.updateAdmin(params, body, identity);
    reply.send({ code: 200, reply: record });
  }

  async function deleteAdmin(request, reply) {
    const record = await svcAdmin.deleteAdmin(request.params);
    reply.send({ code: 200, reply: record });
  }

  return { getAdmins, getAdminByID, addAdmin, updateAdmin, deleteAdmin };
};
