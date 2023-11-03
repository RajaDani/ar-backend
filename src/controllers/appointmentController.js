module.exports = function appointmentController(opts) {
    const { svcAppointment } = opts;

    async function getAppointments(request, reply) {
        const records = await svcAppointment.getAppointments();
        reply.send({ code: 200, reply: records });
    }

    async function getAppointmentByID(request, reply) {
        const records = await svcAppointment.getAppointmentByID(request.params);
        reply.send({ code: 200, reply: records });
    }

    async function addAppointment(request, reply) {
        const record = await svcAppointment.addAppointment(request.body);
        reply.send({ code: 200, reply: record });
    }

    async function updateAppointment(request, reply) {
        const { params, body } = request;
        const record = await svcAppointment.updateAppointment(params, body);
        reply.send({ code: 200, reply: record });
    }
    async function deleteAppointmentByID(request, reply) {
        const record = await svcAppointment.deleteAppointmentByID(request.params);
        reply.send({ code: 200, reply: record });
    }

    return { getAppointments, getAppointmentByID, addAppointment, updateAppointment, deleteAppointmentByID };
};
