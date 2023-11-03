const fp = require("fastify-plugin");

function jwtMiddleware(fastify, opts, next) {
  fastify.decorate("verifyToken", async function verifyToken(req, reply, next) {
    const { JWT, config, logger } = fastify.di().cradle;

    const privateKey = config.get("jwt").secret;

    logger.info("headlocker initailized");
    const header = req.headers["authorization"];
    if (typeof header !== "undefined") {
      let bearerHeader = header.split(" ");
      let token = bearerHeader[1];

      try {
        JWT.verify(token, privateKey);
      } catch (err) {
        err.message = "token expired";
        reply.code(403).send(err);
      }
    } else {
      reply.code(403).send({ message: "Authorization header missing" });
    }
  });

  fastify.decorate(
    "verifyAdminToken",
    async function verifyAdminToken(req, reply, next) {
      const { JWT, config, logger } = fastify.di().cradle;

      const privateKey = config.get("jwt").secret;

      logger.info("headlocker initailized");
      try {
        const header = req.headers["authorization"];
        if (typeof header !== "undefined") {
          let bearerHeader = header.split(" ");
          let token = bearerHeader[1];

          const data = JWT.verify(token, privateKey, (err, dec) => {
            if (err) {
              err.message = "token expire"
              reply.code(403).send(err)
            }
            if (dec) {
              req.identity = dec
            }
          });

        } else {
          reply.code(403).send({ message: "Authorization header missing" });
        }
      } catch (err) {
        err.message = "Forbidden"
        throw reply.code(403).send(err)
      }
    }
  );
  next();
}

module.exports = fp(jwtMiddleware, {
  name: "pcybil-jwtMiddleware",
  fastify: "4.x",
});
