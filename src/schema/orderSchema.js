module.exports = function orderSchema(opts) {
  const { orderController, Joi } = opts;

  const read = ({ fastify }) => {
    return {
      method: "GET",
      url: "/order/read/:limit/:offset",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: orderController.getOrders,
    };
  };

  const readByBusiness = ({ fastify }) => {
    return {
      method: "GET",
      url: "/business/order/read/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyBusinessToken(request, reply);
      },
      handler: orderController.getOrdersByBusiness,
    };
  };

  const readByID = ({ fastify }) => {
    return {
      method: "GET",
      url: "/order/read/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: orderController.getOrderByID,
    };
  };

  const searchOrder = ({ fastify }) => {
    return {
      method: "POST",
      schema: {
        body: Joi.object().keys({
          createdAt: Joi.string().allow(""),
          posted_by: Joi.number().allow(null, ""),
          progress_status: Joi.string().allow(""),
          city_id: Joi.number().allow(null, ""),
          rider_id: Joi.number().optional().allow(null, ""),
          limit: Joi.number().allow(null),
          offset: Joi.number().allow(null),
        }),
      },
      url: "/order/search",
      // preHandler: async (request, reply) => {
      //     await fastify.verifyAdminToken(request, reply);
      // },
      handler: orderController.searchOrders,
    };
  };

  const add = ({ fastify }) => {
    return {
      method: "POST",
      url: "/order/add",
      schema: {
        body: Joi.object()
          .keys({
            custom_item: Joi.array()
              .items(
                Joi.object({
                  business_id: Joi.number().allow(null, ""),
                  name: Joi.string().allow(null, ""),
                  price: Joi.number().allow(null, ""),
                  quantity: Joi.number().allow(null, ""),
                  profit: Joi.number().allow(null, ""),
                  item_picked: Joi.boolean().optional()
                })
              )
              .allow(null),
            order_note: Joi.string().allow(null, ""),
            discount: Joi.number().allow(null, ""),
            delivery_charges: Joi.number().allow(null),
            other_discount: Joi.number().allow(null, ""),
            other_charges: Joi.number().allow(null, ""),
            profit: Joi.number().allow(null, ""),
            total: Joi.number().required(),
            posted_by: Joi.number().required(),
            custom_order: Joi.string().allow(null, ""),
            progress_status: Joi.string().allow(null, ""),
            delivery_time: Joi.string().allow(null, ""),
            item: Joi.array().allow(null),
            customer_id: Joi.number().required(),
            address: Joi.string().required(),
            area_id: Joi.number().required(),
            city_id: Joi.number().required(),
            rider_id: Joi.number().allow(null, ""),
            coupon_id: Joi.number().allow(null),
            order_processing_time: Joi.number().allow(null, ""),
            order_deliver_time: Joi.number().allow(null, ""),
            hold_order_till: Joi.number().optional().allow(null)
          })
          .unknown(true),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: orderController.addOrder,
    };
  };

  const update = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/order/update/:id",
      schema: {
        body: Joi.object().keys({
          custom_item: Joi.array()
            .items(
              Joi.object({
                business_id: Joi.number().allow(null, ""),
                name: Joi.string().allow(null, ""),
                price: Joi.number().allow(null, ""),
                quantity: Joi.number().allow(null, ""),
                profit: Joi.number().allow(null, ""),
                item_picked: Joi.boolean().optional()
              })
            )
            .allow(null),
          order_note: Joi.string().allow(null, ""),
          discount: Joi.number().allow(null, ""),
          delivery_charges: Joi.number().allow(null),
          other_discount: Joi.number().allow(null, ""),
          other_charges: Joi.number().allow(null, ""),
          profit: Joi.number().allow(null, ""),
          total: Joi.number().required(),
          posted_by: Joi.number().required(),
          custom_order: Joi.string().allow(null, ""),
          order_bill_image: Joi.string().allow(null, ""),
          progress_status: Joi.string().required(),
          delivery_time: Joi.string().optional().allow(null, ""),
          item: Joi.array().allow(null),
          customer_id: Joi.number().required(),
          address: Joi.string().required(),
          area_id: Joi.number().required(),
          city_id: Joi.number().required(),
          rider_id: Joi.number().allow(null),
          coupon_id: Joi.number().allow(null),
          order_processing_time: Joi.number().allow(null, ""),
          order_deliver_time: Joi.number().allow(null, ""),
          admin_edited: Joi.boolean().optional(),
          hold_order_till: Joi.number().optional().allow(null),
          rider_accepted_order: Joi.boolean().optional(),
          accepted_order_at: Joi.string().optional(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: orderController.updateOrder,
    };
  };

  const quickUpdate = ({ fastify }) => {
    return {
      method: "PUT",
      url: "/order/update/status/:id",
      schema: {
        body: Joi.object().keys({
          progress_status: Joi.string().allow(null, ""),
          rider_id: Joi.number().allow(null, ""),
          order_processing_time: Joi.number().optional().allow(null, ""),
          order_deliver_time: Joi.number().optional().allow(null, ""),
          rider_accepted_order: Joi.boolean().optional(),
          accepted_order_at: Joi.string().optional(),
        }),
      },
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: orderController.quickUpdateOrder,
    };
  };

  const deleteByID = ({ fastify }) => {
    return {
      method: "DELETE",
      url: "/order/delete/:id",
      preHandler: async (request, reply) => {
        await fastify.verifyAdminToken(request, reply);
      },
      handler: orderController.deleteOrderByID,
    };
  };

  return {
    read,
    searchOrder,
    readByID,
    add,
    update,
    quickUpdate,
    deleteByID,
    readByBusiness,
  };
};
