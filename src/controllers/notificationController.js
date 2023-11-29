module.exports = function notificationController(opts) {
    const { svcNotification } = opts;

    async function sendNotification(request, reply) {
        const records = await svcNotification.sendNotification(request.body);

        reply.send({ code: 200, reply: records });
    }

    return { sendNotification };
};
