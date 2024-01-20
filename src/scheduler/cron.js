let CronJob = require("cron").CronJob;

module.exports = async function cron(opts) {
    const { mdlOrder, Op, mdlUser } = opts;
    const { Order } = mdlOrder;
    const { User } = mdlUser;

    let cronjob = new CronJob(
        "0 */30 * * * *",
        async () => {
            try {
                let idsToBeUpdate = [];
                const holdOrders = await Order.findAll({ where: { progress_status: "hold" }, raw: true })
                const dateTimeNow = new Date().getTime();
                for (let x of holdOrders) {
                    if (dateTimeNow >= x?.hold_order_till) idsToBeUpdate.push(x.id);
                }
                if (idsToBeUpdate?.length) {
                    await Order.update(
                        { progress_status: "pending" },
                        { where: { id: { [Op.in]: idsToBeUpdate } } }
                    )
                }
            } catch (e) {
                console.log(e);
            }
        },
        null,
        true
    );

    let bachatCardsValidate = new CronJob(
        "0 0 */24 * * *",
        async () => {
            try {
                let idsToBeUpdate = [];
                const currentTime = new Date().getTime();
                const users = await User.findAll({
                    where: { [Op.or]: [{ bachat_card_holder: 1 }, { student_card_holder: 1 }] },
                    raw: true
                })
                for (let x of users) {
                    if (currentTime >= x?.card_expiry) idsToBeUpdate.push(x.id);
                }
                if (idsToBeUpdate?.length) {
                    await User.update(
                        { bachat_card_holder: 0, student_card_holder: 0 },
                        { where: { id: { [Op.in]: idsToBeUpdate } } }
                    )
                }
            } catch (e) {
                console.log(e);
            }
        },
        null,
        true
    );
}