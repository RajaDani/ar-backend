module.exports = function mdlJobTypes(opts) {
    const { sequelize, sequelizeCon } = opts;

    const JobTypes = sequelizeCon.define("job_types", {
        id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: sequelize.STRING,
            allowNull: false
        }
    });

    return { JobTypes };
};

