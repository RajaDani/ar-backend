module.exports = function svcOrder(opts) {
    const {
        mdlOrder,
        mdlOrderItems,
        mdlItem,
        mdlUser,
        mdlCustomerAddress,
        mdlBusiness,
        cloudinary,
        Op,
        mdlRider,
        mdlArea,
        sequelizeCon,
        mdlCity,
    } = opts;
    const { Order } = mdlOrder;
    const { Business } = mdlBusiness;
    const { User } = mdlUser;
    const { OrderItem } = mdlOrderItems;
    const { Item } = mdlItem;
    const { Rider } = mdlRider;
    const { CustomerAddress } = mdlCustomerAddress;
    const { Area } = mdlArea;
    const { City } = mdlCity;

    async function getOrders(params) {
        const { limit, offset } = params;
        const count = await Order.count({
            where: { status: 1 }
        })
        const orders = await Order.findAll({
            attributes: ["id", "total", "createdAt", "posted_by", "progress_status"],
            where: {
                status: 1
            },
            include: [
                {
                    model: User,
                    attributes: ["name"]
                },
                {
                    model: CustomerAddress,
                    attributes: ["address_details"]
                },
                {
                    model: Rider,
                    attributes: ["name"]
                },
            ],
            offset: +offset,
            limit: +limit,
        });
        return { orders, count };
    }

    async function getOrderByID(params) {
        const order = await Order.findOne({
            attributes: [
                "id",
                "customer_id",
                "address_id",
                "area_id",
                "order_note",
                "delivery_charges",
                "discount",
                "profit",
                "other_charges",
                "other_discount",
                "progress_status",
                "order_bill_image",
                "rider_id",
                "total",
            ],
            where: { id: params.id },
            include: [
                { model: User, attributes: ["name"] },
                { model: CustomerAddress, attributes: ["address_details"] },
                {
                    model: Area,
                    attributes: ["name", "city_id"],
                    include: [{ model: City, attributes: ["name"] }],
                },
                {
                    model: Rider,
                    attributes: ["name"],
                    required: false,
                },
                {
                    model: OrderItem,
                    attributes: [
                        "order_item_name",
                        "order_item_price",
                        "order_item_quantity",
                        "item_id",
                    ],
                    where: { order_id: sequelizeCon.col("Order.id") },
                    include: [
                        { model: Item, attributes: ["name", "price", "image_url"] },
                    ],
                },
            ],
        });

        let orderData = {};

        if (order) {
            let stringifyData = JSON.stringify(order);
            orderData = JSON.parse(stringifyData);
            orderData["customer"] = orderData["customer"].name;
            orderData["address"] = orderData["customer_address"].address_details;
            const { city_id, name, city } = orderData["area"];
            orderData["area"] = name;
            orderData["city_id"] = city_id;
            orderData["rider"] = orderData["rider"]?.name;
            orderData["city"] = city.name;
            delete orderData["customer_address"];
            let orderItems = orderData.order_items;
            let formattedItems = orderItems.map((x) => {
                return {
                    id: x.item_id,
                    name: x.order_item_name,
                    quantity: x.order_item_quantity,
                    new_price: x.order_item_price,
                    price: x.item?.price,
                    image_url: x.item?.image_url
                }
            })
            delete orderData["order_items"];
            orderData["item"] = formattedItems;
        }
        return orderData
    }

    async function searchOrders(params) {
        let data = {};
        for (let x in params) {
            if (params[x] != null && params[x] != "") {
                if (x == "createdAt") data[x] = { [Op.gt]: `%${params[x]}%` };
                else data[x] = params[x];
            }
        }

        const order = await Order.findAll({
            attributes: ["id", "total", "createdAt", "posted_by", "progress_status"],
            where: data,
            include: [
                {
                    model: User,
                    attributes: ["name"],
                },
                {
                    model: CustomerAddress,
                    attributes: ["address_details"],
                },
                {
                    model: Rider,
                    attributes: ["name"],
                },
            ],
        });
        return order;
    }

    async function addOrder(params) {
        const { item, custom_item } = params;
        delete params["item"];
        delete params["custom_item"];

        const order = await Order.create(params);
        if (custom_item?.length > 0) {
            let customData = await createCustomItem(custom_item);
            let items = await Item.bulkCreate(customData);
            const stringify = JSON.stringify(items);
            const parseData = JSON.parse(stringify);

            for (let x in parseData) {
                for (let y in custom_item)
                    if (parseData[x].name == custom_item[y].name) {
                        parseData[x].quantity = custom_item[y].quantity;
                    }
            }
            parseData.map((x) =>
                item.push({
                    id: x.id,
                    name: x.name,
                    quantity: x.quantity,
                    new_price: x.price,
                })
            );
        }

        const itemData = await mapItemData(item, order.id);

        if (order) {
            await OrderItem.bulkCreate(itemData);
        }
        return order.id;
    }

    async function updateOrder(params, data) {
        const { id } = params;
        const { order_bill_image, item, custom_item } = data;

        delete data["order_bill_image"];
        delete data["item"];
        delete data["custom_item"];

        if (order_bill_image) {
            const { secure_url } = await cloudinary.v2.uploader.upload(
                order_bill_image
            );
            params["order_bill_image"] = secure_url;
        }

        const order = await Order.update(data, { where: { id } });

        if (custom_item?.length > 0) {
            let customData = await createCustomItem(custom_item);
            let items = await Item.bulkCreate(customData);
            const stringify = JSON.stringify(items);
            const parseData = JSON.parse(stringify);

            for (let x in parseData) {
                for (let y in custom_item)
                    if (parseData[x].name == custom_item[y].name) {
                        parseData[x].quantity = custom_item[y].quantity;
                    }
            }
            parseData.map((x) =>
                item.push({
                    id: x.id,
                    name: x.name,
                    quantity: x.quantity,
                    new_price: x.price,
                })
            );
        }

        const itemData = await mapItemData(item, id);
        if (order) {
            await OrderItem.bulkCreate(itemData, {
                updateOnDuplicate: [
                    "order_item_quantity",
                    "order_item_price",
                    "order_item_name",
                    "createdAt",
                    "updatedAt",
                ],
            });
        }
        return id;
    }

    async function deleteOrderByID(params) {
        const order = await Order.update(
            { status: 0 },
            { where: { id: params.id } }
        );
        return order;
    }

    async function createCustomItem(custom_item) {
        let customData = custom_item.map((x) => ({
            name: x.name,
            price: x.price,
            quantity: x.quantity,
            item_type: "single",
            status: 0,
        }));

        return customData;
    }
    // const { custom_item_name, custom_item_price, custom_item_quantity } = custom_data;
    // return await Item.create({
    //     name: custom_item_name,
    //     price: custom_item_price,
    //     quantity: custom_item_quantity,
    //     item_type: "single",
    //     status: 0
    // })

    function mapItemData(item, id) {
        return item.map((x) => ({
            item_id: x.id,
            order_id: id,
            order_item_name: x.name,
            order_item_price: x.new_price,
            order_item_quantity: x.quantity,
        }));
    }

    function customItemData(custom_data, id, customItem) {
        const { custom_item_name, custom_item_price, custom_item_quantity } =
            custom_data;
        return {
            item_id: customItem.id,
            order_id: id,
            order_item_name: custom_item_name,
            order_item_price: custom_item_price,
            order_item_quantity: custom_item_quantity,
        };
    }

    return {
        getOrders,
        getOrderByID,
        searchOrders,
        addOrder,
        updateOrder,
        deleteOrderByID,
    };
};
