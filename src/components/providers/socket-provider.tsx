"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  connected: boolean;
};

export const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (socketRef.current) return; // 🔥 prevent double connect (React strict mode)

    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

