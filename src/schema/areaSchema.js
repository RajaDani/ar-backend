module.exports = function areaSchema(opts) {
    const { areaController, Joi } = opts;

    const read = ({ fastify }) => {
        return {
            method: "GET",
            url: "/area/read",
            handler: areaController.getAreas,
        };
    };

    const readLocationSide = ({ fastify }) => {
        return {
            method: "GET",
            url: "/locationSide/read",
            handler: areaController.getLocationSides,
        };
    };

    const readByID = ({ fastify }) => {
        return {
            method: "GET",
            url: "/area/read/:id",
            handler: areaController.getAreaByID,
        };
    };

    const readByCity = ({ fastify }) => {
        return {
            method: "GET",
            url: "/area/read/city/:id",
            handler: areaController.getAreaByCity,
        };
    };

    const add = ({ fastify }) => {
        return {
            method: "POST",
            url: "/area/add",
            schema: {
                body: Joi.object().keys({
                    name: Joi.string().required(),
                    delivery_charges: Joi.string().required(),
                    city_id: Joi.number().required(),
                    location_side_id: Joi.number().required(),
                    km_from_city: Joi.number().allow("", null),
                    charges_per_km: Joi.number().allow("", null),
                    road_issue: Joi.boolean().allow(0, 1),
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: areaController.addArea,
        };
    };

    const addLocationSide = ({ fastify }) => {
        return {
            method: "POST",
            url: "/locationSide/add",
            schema: {
                body: Joi.object().keys({
                    name: Joi.string().required(),
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: areaController.addLocationSide,
        };
    };

    const update = ({ fastify }) => {
        return {
            method: "PUT",
            url: "/area/update/:id",
            schema: {
                body: Joi.object().keys({
                    name: Joi.string().required(),
                    delivery_charges: Joi.string().required(),
                    city_id: Joi.number().required(),
                    location_side_id: Joi.number().required(),
                    km_from_city: Joi.number().allow("", null),
                    charges_per_km: Joi.number().allow("", null),
                    road_issue: Joi.boolean().allow(0, 1),
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: areaController.updateArea,
        };
    };

    const deleteByID = ({ fastify }) => {
        return {
            method: "DELETE",
            url: "/area/delete/:id",
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: areaController.deleteAreaByID,
        };
    };

    return { read, readLocationSide, readByID, readByCity, add, addLocationSide, update, deleteByID };
};
