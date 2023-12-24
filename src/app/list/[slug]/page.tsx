"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { List } from "@/app/_components/list";
import { useSession } from "next-auth/react";
import { Loading } from "@/app/_components/loading";
import { Separator } from "@/components/ui/separator";

export default function Page({ params }: { params: { slug: string } }) {
  const session = useSession();

  if (session.status === "loading") {
    return (
      <div>
        <Link href="/">
          <Button className="mb-2 mt-4" variant="ghost">
            <ChevronLeft className="h-8 w-8" />
          </Button>
        </Link>
        <Separator />
        <Loading />
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    redirect(`/signIn?slug=${params.slug}`);
  }

  return (
    <div>
      <Link href="/">
        <Button className="mb-2 mt-4" variant="ghost">
          <ChevronLeft className="h-8 w-8" />
        </Button>
      </Link>
      <Separator />

      <List slug={params.slug} />
    </div>
  );
}
