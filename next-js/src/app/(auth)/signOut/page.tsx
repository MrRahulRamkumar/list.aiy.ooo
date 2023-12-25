"use client";

import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function Component() {
  const [loading, setLoading] = useState(false);
  const session = useSession();
  if (session.status === "unauthenticated") {
    redirect("/signIn");
  }

  return (
    <main className="flex flex-col items-center justify-center p-10">
      <div className="w-full max-w-[500px] space-y-6">
        <Card className="flex flex-col items-center space-y-4 bg-white p-6 dark:bg-gray-800">
          <LogOut className="h-12 w-12 text-red-500 dark:text-red-400" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Are you sure you want to sign out?
          </h2>
          <div className="flex space-x-4">
            <Link href="/">
              <Button className="w-full">Cancel</Button>
            </Link>
            <Button
              disabled={loading}
              onClick={() => {
                setLoading(true);
                void signOut({ callbackUrl: "/signIn" });
              }}
              className="w-full"
              variant="outline"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Please Wait" : " Sign Out"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
