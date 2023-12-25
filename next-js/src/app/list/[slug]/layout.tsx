"use client";

import { ListPageContext } from "@/lib/list-page-context";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { type Socket } from "socket.io-client";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <>{children}</>
    </SessionProvider>
  );
}
