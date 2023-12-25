import { createContext } from "react";
import { type Socket } from "socket.io-client";

interface ListPageContextType {
  socket: Socket | null;
}
export const ListPageContext = createContext<ListPageContextType | null>(null);
