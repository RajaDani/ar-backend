var CryptoJS = require("crypto-js");

module.exports = function Encryption(opts) {
  const { config, JWT } = opts;

  function hashPassword(password, config) {
    const privateKey = config.get("jwt").secret;
    const combinedString = password;

    return CryptoJS.SHA256(combinedString, privateKey).toString();
  }

  async function generateToken(data) {
    const privateKey = config.get("jwt").secret;
    const token = JWT.sign(
      { name: data.name, email: data.email, id: data.id, role: "client" },
      privateKey,
      {
        expiresIn: "30d",
      }
    );
    if (token) return token;
  }

  async function generateAdminToken(data) {
    const privateKey = config.get("jwt").secret;
    const token = JWT.sign(
      {
        name: data.name,
        email: data.email,
        id: data.id,
        admin_type: data.admin_type
      },
      privateKey,
      {
        expiresIn: "7d",
      }
    );
    if (token) return token;
  }

  return { hashPassword, generateToken, generateAdminToken };
};
