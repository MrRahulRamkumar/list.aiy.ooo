"use client";

import { useSocket } from "@/lib/hooks";
import { ListPageContext } from "@/lib/list-page-context";
import { SessionProvider } from "next-auth/react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const socket = useSocket();

  return (
    <SessionProvider>
      <ListPageContext.Provider value={{ socket }}>
        <>{children}</>
      </ListPageContext.Provider>
    </SessionProvider>
  );
}
