module.exports = function svcArea(opts) {
    const { sequelize, sequelizeCon, mdlArea, mdlCity, mdlLocationSide } = opts;
    const { Area } = mdlArea;
    const { City } = mdlCity;
    const { LocationSide } = mdlLocationSide;

    async function getAreas(params) {
        const areas = await Area.findAll({
            attributes: ["id", "name", "delivery_charges", "road_issue"],
            include: [{
                model: City,
                attributes: ["name"]
            },
            {
                model: LocationSide,
                attributes: ["name"]
            }
            ],
            where: {
                status: 1
            }
        });
        return areas;
    }

    async function getLocationSides(params) {
        const areas = await LocationSide.findAll({
            attributes: ["id", "name"],
            where: {
                status: 1
            }
        });
        return areas;
    }

    async function getAreaByID(params) {
        const area = await Area.findOne({
            attributes: ["id", "name", "delivery_charges", "location_side_id", "km_from_city"
                , "charges_per_km", "road_issue", "city_id"],
            where: {
                id: params.id,
            },
            include: [{
                model: City,
                attributes: ["name"]
            },
            {
                model: LocationSide,
                attributes: ["name"]
            }
            ],

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

    async function addLocationSide(params) {
        const area = await LocationSide.create(params);
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
        getLocationSides,
        getAreaByID,
        getAreaByCity,
        addArea,
        addLocationSide,
        updateArea,
        deleteAreaByID
    };
};
