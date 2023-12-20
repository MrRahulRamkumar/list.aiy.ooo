import Link from "next/link";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { List } from "@/app/_components/list";

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/signIn");
  console.log(params);
  return (
    <div>
      <Link href="/">
        <Button className="mt-4" variant="ghost">
          <ChevronLeft className="h-8 w-8" />
        </Button>
      </Link>

      <List userId={session.user.id} listSlug={params.slug} />
    </div>
  );
}
