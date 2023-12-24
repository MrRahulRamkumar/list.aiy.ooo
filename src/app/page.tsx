import { getServerAuthSession } from "@/server/auth";
import { ShoppingList } from "./_components/shopping-list";
import { redirect } from "next/navigation";
import { CreateShoppingList } from "./_components/create-shopping-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { Loading } from "./_components/loading";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/signIn");
  return (
    <>
      <main className="w-full py-4 sm:py-6 md:py-12">
        <Tabs defaultValue="owner" className="mx-8">
          <TabsList className=" grid grid-cols-2">
            <TabsTrigger value="owner">My lists</TabsTrigger>
            <TabsTrigger value="collaborator">My collabs</TabsTrigger>
          </TabsList>
          <TabsContent value="owner">
            <Suspense fallback={<Loading />}>
              <div className="container mx-auto grid max-w-sm gap-4 px-2 sm:max-w-md sm:gap-6 sm:px-4 md:max-w-xl md:gap-8 md:px-6 lg:max-w-none">
                <ShoppingList type="owner" />
              </div>
              <div className="flex items-center justify-center p-4">
                <CreateShoppingList />
              </div>
            </Suspense>
          </TabsContent>
          <TabsContent value="collaborator">
            <Suspense fallback={<Loading />}>
              <div className="container mx-auto grid max-w-sm gap-4 px-2 sm:max-w-md sm:gap-6 sm:px-4 md:max-w-xl md:gap-8 md:px-6 lg:max-w-none">
                <ShoppingList type="collaborator" />
              </div>
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
