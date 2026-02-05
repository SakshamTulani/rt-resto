import { Server as SocketServer } from "socket.io";
import type { Server as HttpServer } from "http";
import { env } from "./config";

let io: SocketServer | null = null;

export function initializeSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: [env.USER_APP_URL, env.ADMIN_APP_URL],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join:order", (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`Socket ${socket.id} joined order:${orderId}`);
    });

    // Admin/kitchen join all orders room
    socket.on("join:admin", () => {
      socket.join("admin");
      console.log(`Socket ${socket.id} joined admin room`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): SocketServer {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
}

// Event emitters for order updates
export const orderEvents = {
  created: (order: {
    id: string;
    sessionId: string;
    userId?: string | null;
  }) => {
    const io = getIO();
    // Notify admin/kitchen
    io.to("admin").emit("order:created", {
      orderId: order.id,
      sessionId: order.sessionId,
      userId: order.userId,
    });
  },

  statusUpdated: (order: {
    id: string;
    sessionId: string;
    status: string;
    previousStatus: string;
  }) => {
    const io = getIO();
    // Notify admin/kitchen
    io.to("admin").emit("order:status-updated", {
      orderId: order.id,
      status: order.status,
      previousStatus: order.previousStatus,
    });
    // Notify specific order room (user watching their order)
    io.to(`order:${order.id}`).emit("order:status-updated", {
      orderId: order.id,
      status: order.status,
      previousStatus: order.previousStatus,
    });
  },

  cancelled: (order: { id: string; sessionId: string }) => {
    const io = getIO();
    io.to("admin").emit("order:cancelled", { orderId: order.id });
    io.to(`order:${order.id}`).emit("order:cancelled", { orderId: order.id });
  },
};
