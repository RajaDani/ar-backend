let CronJob = require("cron").CronJob;

module.exports = async function cron(opts) {
    const { mdlOrder, Op, mdlUser, mdlUserMembership } = opts;
    const { Order } = mdlOrder;
    const { User } = mdlUser;
    const { UserMembership } = mdlUserMembership;

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
                let idsToBeUpdateBachat = [];
                let idsToBeUpdateStudent = [];
                const currentTime = new Date().getTime();
                const users = await User.findAll({
                    where: { [Op.or]: [{ bachat_card_holder: 1 }, { student_card_holder: 1 }] },
                    raw: true
                })
                for (let x of users) {
                    if (currentTime >= x?.bachat_card_expiry) idsToBeUpdateBachat.push(x.id);
                    if (currentTime >= x?.student_card_expiry) idsToBeUpdateStudent.push(x.id);
                }
                if (idsToBeUpdateBachat?.length) {
                    await User.update(
                        { bachat_card_holder: 0 },
                        { where: { id: { [Op.in]: idsToBeUpdateBachat } } }
                    )
                    await UserMembership.update(
                        { card_status: "expired" },
                        { where: { user_id: { [Op.in]: idsToBeUpdateBachat }, card_type: "bachat_card" } }
                    )
                }
                if (idsToBeUpdateStudent?.length) {
                    await User.update(
                        { student_card_holder: 0 },
                        { where: { id: { [Op.in]: idsToBeUpdateStudent } } }
                    )
                    await UserMembership.update(
                        { card_status: "expired" },
                        { where: { user_id: { [Op.in]: idsToBeUpdateStudent }, card_type: "student_card" } }
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