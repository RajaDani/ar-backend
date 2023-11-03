module.exports = function svcArea(opts) {
    const { sequelize, sequelizeCon, mdlArea, mdlCity } = opts;
    const { Area } = mdlArea;
    const { City } = mdlCity;

    async function getAreas(params) {
        // sequelizeCon.sync({ force: true });
        const areas = await Area.findAll({
            attributes: ["id", "name", "delivery_charges"],
            include: [{
                model: City,
                attributes: ["name"]
            }],
            where: {
                status: 1
            }
        });
        return areas;
    }

    async function getAreaByID(params) {
        const area = await Area.findOne({
            attributes: ["id", "name", "delivery_charges", "city_id"],
            where: {
                id: params.id,
            },
            include: [{
                model: City,
                attributes: ["name"]
            }]
        });
        return area
    }

    async function getAreaByCity(params) {
        const area = await Area.findAll({
            attributes: ["id", "name", "delivery_charges"],
            where: {
                city_id: params.id,
            },
        });
        return area
    }


    async function addArea(params) {
        const area = await Area.create(params);
        return area.id;
    }

    async function updateArea(params, data) {
        const area = await Area.update(
            data,
            {
                where: {
                    id: params.id,
                },
            }
        );

        return { code: 200, msg: area };
    }

    async function deleteAreaByID(params) {
        const area = await Area.update({
            status: 0
        },
            {
                where: {
                    id: params.id,
                },

            });
        return area
    }

    return {
        getAreas,
        getAreaByID,
        getAreaByCity,
        addArea,
        updateArea,
        deleteAreaByID
    };
};
