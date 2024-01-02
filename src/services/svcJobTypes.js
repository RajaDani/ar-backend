module.exports = function svcJobTypes(opts) {
    const { mdlJobTypes } = opts;
    const { JobTypes } = mdlJobTypes;

    async function addJobType(body) {
        const type = await JobTypes.create(body);
        return type;
    }

    async function getJobTypes(body) {
        const type = await JobTypes.findAll(body);
        return type;
    }

    return {
        getJobTypes,
        addJobType,
    };
};
