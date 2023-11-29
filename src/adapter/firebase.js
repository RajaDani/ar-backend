const admin = require("firebase-admin");

const nconf = require("nconf");

nconf.env().argv();
const env = nconf.get("benv");
const config = require(`../env/${env}`);

const serviceAccount = config.firebase;
const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

module.exports = firebase;
