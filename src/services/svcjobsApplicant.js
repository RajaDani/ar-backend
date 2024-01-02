module.exports = function svcRider(opts) {
  const { mdlJobs, cloudinary, Boom } = opts;
  const { JobsApplications } = mdlJobs;

  async function getApplications() {
    const applications = await JobsApplications.findAll({ where: { status: 1 } })
    return applications;
  }

  async function addApplication(params) {
    const { name, cnic, job_type, image_url } = params;
    // sequelizeCon.sync();
    delete params["image_url"];
    const count = JobsApplications.findOne({
      where: { cnic, job_type },
    });
    if (count) throw Boom.conflict("Your application is already submitted!");

    if (image_url) {
      const { secure_url } = await cloudinary.v2.uploader.upload(image_url);
      params["image_url"] = secure_url;
    }
    const Jobs = await JobsApplications.create(params);

    return { id: Jobs.id };
  }

  async function removeApplication(params) {
    const application = await JobsApplications.update({ status: 0 }, { where: { id: params.id } })
    return application;
  }

  return { getApplications, addApplication, removeApplication };
};
