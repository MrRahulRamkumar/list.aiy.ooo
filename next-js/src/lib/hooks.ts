import { useEffect, useState } from "react";
import io, { type Socket } from "socket.io-client";
import { env } from "@/env";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIO = io(env.NEXT_PUBLIC_SOCKET_URL, {
      reconnection: true,
      upgrade: true,
      transports: ["websocket", "polling"],
    });

    setSocket(socketIO);

    return function () {
      socketIO.disconnect();
    };
  }, []);

  return socket;
}
