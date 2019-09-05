const dgram = require("dgram");
const transform = require("./lib/transform");
const authenticator = require("./lib/authenticator");

const RADIUS_PORT = 1812;

function startServer(serverCallbacks, password, port = RADIUS_PORT) {
  const server = dgram.createSocket("udp4");

  serverCallbacks = serverCallbacks || {};

  function sendToClient(address, port, packet) {
    const buffer = transform.packetToBuffer(packet);

    server.send(buffer, port, address, (error) => {
      if ("errorCallback" in serverCallbacks && error)
       serverCallbacks.errorCallback(error)
      else if ("sentCallback" in serverCallbacks && !error)
        serverCallbacks.sentCallback(address, port, packet)
    });
  }
  
  server.on("error", (error) => {
    if ("errorCallback" in serverCallbacks)
      serverCallbacks.errorCallback(error)

    server.close();
  });
  
  server.on("message", async (msg, rinfo) => {
    const packet = transform.bufferToPacket(Buffer.from(msg));
    const identifier = packet.identifier;
    const requestAuthenticator = packet.authenticator;

    if ("messageCallback" in serverCallbacks) {
      const reply = await serverCallbacks.messageCallback(rinfo.address, rinfo.port, packet) || {};

      if ("code" in reply) {
        reply.identifier = identifier;
        reply.authenticator = requestAuthenticator;
        reply.authenticator = authenticator.compute(reply, password);

        sendToClient(rinfo.address, rinfo.port, reply);
      }
    }
  });
  
  server.on("listening", () => {
    const address = server.address();

    if ("listenCallback" in serverCallbacks)
      serverCallbacks.listenCallback(address)
  });
  
  server.bind(port);

  return server;
}

module.exports = {
  startServer: startServer,
}