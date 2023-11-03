module.exports = function svcArea(opts) {
    const { sequelize, sequelizeCon, mdlOrder, mdlItem, Op, mdlUser, mdlCustomerAddress, mdlRider } = opts;
    const { Order } = mdlOrder;
    const { Item } = mdlItem;
    const { User } = mdlUser;
    const { CustomerAddress } = mdlCustomerAddress;
    const { Rider } = mdlRider;

    async function getDashboardAnalytics() {
        const orders = await Order.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('delivery_charges')), 'delivery_earnings'],
                [sequelize.fn('SUM', sequelize.col('profit')), 'order_profit'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'total_orders'],
            ]
        })

        const items = await Item.findOne({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'total_items'],
            ]
        })
        const data = { orders, items };
        return data;



    }

    async function getOrdersByCity() {
        const orders = await sequelizeCon.query(`
        SELECT City.name AS cityName, COUNT(Orders.id) AS orderCount
        FROM Orders
        INNER JOIN Areas ON Orders.area_id = Areas.id
        INNER JOIN Cities AS City ON Areas.city_id = City.id
        GROUP BY cityName;
      `, {
            type: sequelize.QueryTypes.SELECT,
        })
        return orders;
    }

    var timeFrom = (X) => {
        var dates = [];
        for (let I = 0; I < Math.abs(X); I++) {
            dates.push(new Date(new Date().getTime() - ((X >= 0 ? I : (I - I - I)) * 24 * 60 * 60 * 1000)).toLocaleDateString('en-GB'));
        }
        return dates;
    }

    async function getOrdersByWeek() {
        const last7days = new Date();
        last7days.setDate(last7days.getDate() - 7);
        const days = timeFrom(7);

        const orders = await Order.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%d/%m/%Y'), 'date'],
                // [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%b'), 'month_name'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
            ],
            where: {
                createdAt: {
                    [Op.gte]: last7days,
                },
            },
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%d/%m/%Y')],
            order: sequelize.literal('date ASC'),
        })

        let stringify = JSON.stringify(orders);
        let data = JSON.parse(stringify);
        let dates = data.map((x) => x.date);

        let orderData = data;
        for (let i = 0; i < days.length; i++) {
            if (!dates.includes(days[i])) orderData.push({ date: days[i], orders: 0 })
        }

        orderData.sort((a, b) => {
            return parseInt(a.date) - parseInt(b.date);
        });

        return orderData;
    }

    async function getLatestTransactions() {
        const orders = await Order.findAll({
            limit: 10,
            order: [["id", "DESC"]],
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
            ]
        })

        return orders;
    }

    return {
        getDashboardAnalytics,
        getOrdersByCity,
        getOrdersByWeek,
        getLatestTransactions,
    };
};
