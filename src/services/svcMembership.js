module.exports = function svcMembership(opts) {
    const { sequelizeCon, sequelize, mdlUserMembership, mdlUser, Op, Boom, mdlCity } = opts;

    const { UserMembership } = mdlUserMembership;
    const { User } = mdlUser;
    const { City } = mdlCity;

    async function getMemberships(params) {
        const memberships = await UserMembership.findAll({
            attributes: ["id", "card_type", "payment_method", "card_status", "user_id", "address_1", "address_2", "card_expiry"],
            include: [{
                model: User,
                attributes: ["name"],
                include: [{
                    model: City,
                    attributes: ["name"]
                }]
            }],
            where: {
                status: 1,
            },
        });
        return memberships;
    }

    async function addMembership(body) {
        const count = await UserMembership.count({
            where: {
                [Op.or]: [{ user_id: body.user_id },
                { card_type: body.card_type }, { card_status: "expired" }]
            }
        })
        if (count > 0) throw Boom.conflict("You request is already in progress!");;
        const membership = await UserMembership.create(body);
        return membership.id;
    }

    async function updateMembership(params, body) {
        const { id, user_id } = params;
        const card_expiry = new Date(body?.card_expiry).getTime();
        const membership = await UserMembership.update(body, {
            where: { id }
        });

        let cond = "";
        if (body.card_status == "pending" || body.card_status == "expired") {
            cond = `${body.card_type === "bachat_card" ? `bachat_card_holder = 0,bachat_card_expiry=${card_expiry}` : `student_card_holder = 0,student_card_expiry=${card_expiry}`}`
        }
        else cond = `${body.card_type === "bachat_card" ? `bachat_card_holder = 1,bachat_card_expiry=${card_expiry}` : `student_card_holder = 1,student_card_expiry=${card_expiry}`}`

        const sql = `UPDATE customers SET ${cond}  WHERE id = ${user_id}`

        await sequelizeCon.query(sql, {
            type: sequelize.QueryTypes.UPDATE,
        });

        return membership.id;
    }

    return {
        getMemberships,
        addMembership,
        updateMembership
    };
};