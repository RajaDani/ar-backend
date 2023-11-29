module.exports = function svcRiderLocation(opts) {
  const { sequelizeCon, mdlRiderLocation, mdlRider } = opts;
  const { RiderLocation } = mdlRiderLocation;
  const { Rider } = mdlRider;

  async function getLocation(params) {
    // RiderLocation.sync({ force: true });
    const ridersLocation = await RiderLocation.findAll({
      attributes: ["lat", "lng"],
      include: [
        {
          model: Rider,
          attributes: ["name"],
        },
      ],
    });
    return ridersLocation;
  }
  async function updateLocation(body) {
    const existingLocation = await RiderLocation.findOne({
      where: { rider_id: body.rider_id },
    });
    if (existingLocation) {
      const updatedLocation = await existingLocation.update(body);
      return updatedLocation;
    } else {
      const newLocation = await RiderLocation.create(body);
      return newLocation;
    }
  }

  return {
    updateLocation,
    getLocation,
  };
};
