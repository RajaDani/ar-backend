module.exports = function areaSchema(opts) {
    const { areaController, Joi } = opts;

    const read = ({ fastify }) => {
        return {
            method: "GET",
            url: "/area/read",
            handler: areaController.getAreas,
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
                }),
            },
            preHandler: async (request, reply) => {
                await fastify.verifyAdminToken(request, reply);
            },
            handler: areaController.addArea,
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

    return { read, readByID, readByCity, add, update, deleteByID };
};
