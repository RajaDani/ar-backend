module.exports = function svcAppointment(opts) {
    const { sequelize, sequelizeCon, mdlAppointment, mdlUser, mdlItem, mdlCustomerAddress } = opts;
    const { Appointment } = mdlAppointment;
    const { User } = mdlUser;
    const { Item } = mdlItem;
    const { CustomerAddress } = mdlCustomerAddress;

    async function getAppointments(params) {
        sequelizeCon.sync();
        const appointments = await Appointment.findAll({
            attributes: ["id", "appointment_type", "appointment_fee", "platform_fee", "posted_by", "appointment_progress", "appointment_date", "appointment_time"],
            include: [{
                model: Item,
                attributes: ["name", "image_url"]
            }],
            where: {
                status: 1
            }
        });
        return appointments;
    }

    async function getAppointmentByID(params) {
        const appointment = await Appointment.findOne({
            attributes: ["id", "appointment_type", "appointment_fee", "platform_fee", "appointment_date", "appointment_time",
                "appointment_progress", "payment_method", "customer_id", "address_id", "item_id"],
            where: {
                id: params.id,
            },
            include: [{
                model: Item,
                attributes: ["name", "image_url"]
            },
            {
                model: User,
                attributes: ["name"]
            },
            {
                model: CustomerAddress,
                attributes: ["address_details"]
            }
            ]
        });
        return appointment
    }

    async function addAppointment(params) {
        const appointment = await Appointment.create(params);
        return appointment.id;
    }

    async function updateAppointment(params, data) {
        const appointment = await Appointment.update(
            data,
            {
                where: {
                    id: params.id,
                },
            }
        );

        return appointment
    }

    async function deleteAppointmentByID(params) {
        const appointment = await Appointment.update({
            status: 0
        },
            {
                where: {
                    id: params.id,
                },

            });
        return appointment
    }

    return {
        getAppointments,
        getAppointmentByID,
        addAppointment,
        updateAppointment,
        deleteAppointmentByID
    };
};
