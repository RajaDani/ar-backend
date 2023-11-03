const { required } = require("joi");
const FastServer = require("./globals/server");
const routes = require("./routes");
const jwtMiddleware = require("./middleware/jwtMiddleware");

module.exports.bootstrap = async (process) => {
  try {
    const server = await FastServer({
      process,
    });

    await server.registerRoutes({ routes });
    await server.registerMiddleware(jwtMiddleware);

    await server.start();
  } catch (_error) {
    console.error("Fatal Error In Bootstrap > ", _error);
    process.exit(1);
  }
};
