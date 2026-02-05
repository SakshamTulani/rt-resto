import { createServer } from "http";
import { app } from "./app";
import { env } from "./config";
import { initializeSocket } from "./socket";

const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

httpServer.listen(env.PORT, () => {
  console.log(`API server running on http://localhost:${env.PORT}`);
  console.log(`Health check: http://localhost:${env.PORT}/health`);
  console.log(`WebSocket server ready`);
});
