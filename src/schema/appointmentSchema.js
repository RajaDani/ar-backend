module.exports = function appointmentSchema(opts) {
    const { appointmentController, Joi } = opts;

    const read = ({ fastify }) => {
        return {
            method: "GET",
            url: "/appointment/read",
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: appointmentController.getAppointments,
        };
    };

    const readByID = ({ fastify }) => {
        return {
            method: "GET",
            url: "/appointment/read/:id",
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: appointmentController.getAppointmentByID,
        };
    };

    const add = ({ fastify }) => {
        return {
            method: "POST",
            url: "/appointment/add",
            schema: {
                body: Joi.object().keys({
                    appointment_fee: Joi.number().required(),
                    platform_fee: Joi.number().required(),
                    app_holder_name: Joi.string().allow("", null),
                    app_holder_address: Joi.string().allow("", null),
                    appointment_type: Joi.string().required(),
                    appointment_date: Joi.string().required(),
                    appointment_time: Joi.string().required(),
                    appointment_progress: Joi.string().required(),
                    payment_method: Joi.number().required(),
                    posted_by: Joi.number().required(),
                    customer_id: Joi.number().required(),
                    item_id: Joi.number().required(),
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: appointmentController.addAppointment,
        };
    };

    const update = ({ fastify }) => {
        return {
            method: "PUT",
            url: "/appointment/update/:id",
            schema: {
                body: Joi.object().keys({
                    appointment_fee: Joi.number().required(),
                    platform_fee: Joi.number().required(),
                    app_holder_name: Joi.string().allow("", null),
                    app_holder_address: Joi.string().allow("", null),
                    appointment_type: Joi.string().required(),
                    appointment_date: Joi.string().required(),
                    appointment_time: Joi.string().required(),
                    appointment_progress: Joi.string().required(),
                    payment_method: Joi.number().required(),
                    customer_id: Joi.number().required(),
                    item_id: Joi.number().required(),
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: appointmentController.updateAppointment,
        };
    };

    const deleteByID = ({ fastify }) => {
        return {
            method: "DELETE",
            url: "/appointment/delete/:id",
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: appointmentController.deleteAppointmentByID,
        };
    };

    return { read, readByID, add, update, deleteByID };
};
