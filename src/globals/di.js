const awilix = require("awilix");
const Joi = require("joi");
// Joi.objectId = require("joi-objectid")(Joi);
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const container = awilix.createContainer();
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const sequelizeCon = require("../adapter/sequelize");
const cloudinary = require('cloudinary');
const Boom = require("boom")

module.exports = async function FastDI(options = {}) {
  const logger = _.get(options, "logger", undefined);
  const config = _.get(options, "config", undefined);

  if (logger === undefined)
    throw new Error("FastDI is dependent on [logger] instance");

  if (config === undefined)
    throw new Error("FastDI is dependent on [config] instance");

  cloudinary.config({
    cloud_name: 'dnffom2yb',
    api_key: '635355277948733',
    api_secret: 'LOiH5fgs_cMuPvfGFS_FpgiJ0ic'
  });


  container.register({
    config: awilix.asValue(config),
    logger: awilix.asValue(logger),
    Joi: awilix.asValue(Joi),
    _: awilix.asValue(_),
    sequelize: awilix.asValue(Sequelize),
    JWT: awilix.asValue(jwt),
    sequelizeCon: awilix.asValue(sequelizeCon),
    Op: awilix.asValue(Op),
    cloudinary: awilix.asValue(cloudinary),
    Boom: awilix.asValue(Boom),
  });

  container.loadModules(
    [
      "../models/**/*.js",
      "../services/**/*.js",
      "../helpers/**/*.js",
      "../schema/**/*.js",
      "../controllers/**/*.js",
      "../middleware/**/*.js",
    ],
    {
      cwd: __dirname,
      formatName: "camelCase",
      resolverOptions: {
        lifetime: awilix.Lifetime.SINGLETON,
        register: awilix.asFunction,
      },
    }
  );

  const _container = async () => container;

  // const register = async (type, value) => {
  //   switch (type) {
  //     case "sequelizeCon":
  //       container.register(
  //         "sequelizeCon",
  //         awilix.asFunction(() => value).singleton()
  //       );
  //       break;
  //   }
  // };

  return {
    _container,
    // register,
  };
};
