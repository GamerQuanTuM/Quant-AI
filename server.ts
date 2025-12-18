// server.ts (or server.js)
import { createServer } from "node:http";
import next from "next";
import { getIO } from "@/lib/socket";
import { startSocketEventConsumer } from "@/lib/socket-event-consumer";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// FIX 1: Store userId -> socketId mapping correctly
const socketUsers = new Map<string, string>();
const socketToUser = new Map<string, string>(); // Reverse mapping

app.prepare().then(async () => {
  const httpServer = createServer(handler);

  const io = getIO(httpServer);

  try {
    await startSocketEventConsumer();
    console.log("✅ Socket Event Consumer started");
  } catch (error) {
    console.error("❌ Failed to start socket event consumer:", error);
  }

  io.on("connection", (socket) => {
    console.log("🟢 Socket Connected:", socket.id);

    // Handle user joining with their userId
    socket.on("join", ({ userId }: { userId: string }) => {
      if (!userId) {
        console.warn("⚠️ Join attempt without userId");
        return;
      }

      // Join user-specific room
      socket.join(`user:${userId}`);

      // FIX 2: Store both mappings
      socketUsers.set(userId, socket.id);
      socketToUser.set(socket.id, userId);

      console.log(`✅ User ${userId} joined room user:${userId} (socket: ${socket.id})`);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("🔴 Socket Disconnected:", socket.id);

      // FIX 3: Clean up both mappings correctly
      const userId = socketToUser.get(socket.id);
      if (userId) {
        socketUsers.delete(userId);
        socketToUser.delete(socket.id);
        console.log(`🔴 User ${userId} disconnected`);
      }
    });

    // FIX 4: Add error handling
    socket.on("error", (error) => {
      console.error("❌ Socket Error:", error);
    });
  });

  // FIX 5: Add proper error handling for server
  httpServer
    .once("error", (err) => {
      console.error("❌ Server Error:", err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`
🚀 Server ready!
- Local:   http://${hostname}:${port}
- Network: ${process.env.NEXT_PUBLIC_APP_URL || `http://${hostname}:${port}`}
      `);
    });

  // FIX 6: Graceful shutdown
  const gracefulShutdown = () => {
    console.log("\n⏳ Shutting down gracefully...");

    io.close(() => {
      console.log("✅ Socket.IO closed");
    });

    httpServer.close(() => {
      console.log("✅ HTTP server closed");
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error("❌ Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
});

// FIX 7: Export for use in API routes
export { socketUsers };