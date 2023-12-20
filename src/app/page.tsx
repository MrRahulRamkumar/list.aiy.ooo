import { getServerAuthSession } from "@/server/auth";
import { ShoppingList } from "./_components/shopping-list";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/signIn");

  return <ShoppingList />;
}
