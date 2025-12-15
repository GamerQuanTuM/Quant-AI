import { Server as IOServer } from "socket.io";

declare global {
  // eslint-disable-next-line no-var
  var io: IOServer | undefined;
}

export function getIO(server?: any) {
  if (!global.io && server) {
    global.io = new IOServer(server, {
      cors: {
        origin: "*",
      },
    });
  }

  if (!global.io) {
    throw new Error("Socket.io not initialized");
  }

  return global.io;
}
