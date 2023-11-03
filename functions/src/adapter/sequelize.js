const Sequelize = require("sequelize");
const nconf = require("nconf");

nconf.env().argv();
const env = nconf.get("benv");
const config = require(`../env/${env}`);

const sequelize = new Sequelize(config.dbConfig);

module.exports = sequelize;
