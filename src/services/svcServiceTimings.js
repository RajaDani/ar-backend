module.exports = function svcServiceTimings(opts) {
    const { mdlServiceTime } = opts;
    const { ServiceTime } = mdlServiceTime;

    async function getServiceTimings(params) {
        const servicetimings = await ServiceTime.findOne({
            attributes: ["id", "start_time", "end_time", "availability"],
        });
        return servicetimings;
    }

    async function updateServiceAvailability(params) {
        const { value } = params;
        const id = await ServiceTime.update(
            { availability: value },
            {
                where: {
                    id: 1
                },
            }
        );

        return { code: 200, msg: id };
    }

    return {
        getServiceTimings,
        updateServiceAvailability
    };
};
