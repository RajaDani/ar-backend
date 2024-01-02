module.exports = function mdlJobs(opts) {
  const { sequelize, sequelizeCon } = opts;

  const JobsApplications = sequelizeCon.define("jobs_applications", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: sequelize.STRING,
      allowNull: false,
    },
    contact: {
      type: sequelize.BIGINT,
      allowNull: true,
    },
    cnic: {
      type: sequelize.BIGINT,
      allowNull: true,
    },
    email: {
      type: sequelize.STRING,
      allowNull: true,
    },
    job_type: {
      type: sequelize.STRING,
      allowNull: true,
    },
    image_url: {
      type: sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: sequelize.BOOLEAN,
      defaultValue: true
    }
  });

  return { JobsApplications };
};
