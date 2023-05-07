const { Server } = require("socket.io");

module.exports = (server, app) => {
  const io = new Server(server);
  io.on("connection", () => {
    console.log("a new connection received");
  });

  // register io in all requests
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  return io;
};
