import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { ShareDialog } from "@/app/_components/share-dialog";
import { CreateShoppingListDialog } from "@/app/_components/create-shopping-list-dialog";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { type SelectShoppingList, type SelectUser } from "@/server/db/schema";

export async function ShoppingList() {
  const shoppingLists = await api.shoppingList.getShoppingLists.query();

  return (
    <>
      <main className="w-full py-4 sm:py-6 md:py-12">
        <div className="container mx-auto grid max-w-sm gap-4 px-2 sm:max-w-md sm:gap-6 sm:px-4 md:max-w-xl md:gap-8 md:px-6 lg:max-w-none">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4 md:gap-8">
            <div className="grid gap-1">
              <div className="flex-cols flex">
                <h1 className="pr-1 text-3xl font-bold tracking-tight">
                  Your Lists
                </h1>
                <div className="flex flex-col items-end justify-center">
                  <Link href={"/api/auth/signout"}>
                    <Button variant="ghost">
                      <LogOut className="h-6 w-6" />
                    </Button>
                  </Link>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                Manage your shopping lists and collaborate with others
              </p>
            </div>
          </div>

          {shoppingLists.length === 0 && (
            <div className="flex items-center justify-center p-4">
              <p className="text-xl text-gray-500">
                No shopping lists, create one by clicking the button below
              </p>
            </div>
          )}
          {shoppingLists.length > 0 && (
            <div className="grid gap-4 sm:gap-6 md:gap-8">
              {shoppingLists.map((sl) => {
                return (
                  <ShoppingListItem
                    key={sl.id.toString()}
                    shoppingList={sl}
                    owner={sl.createdBy}
                    collaborators={sl.collaborators}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center p-4">
          <CreateShoppingListDialog />
        </div>
      </main>
    </>
  );
}

interface ShoppingListItemProps {
  shoppingList: SelectShoppingList;
  owner: SelectUser;
  collaborators: {
    userId: string;
    shoppingListId: number;
    user: SelectUser;
  }[];
}

export function ShoppingListItem({
  shoppingList,
  owner,
  collaborators,
}: ShoppingListItemProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="hover:red-500 flex flex-col items-center space-x-1 sm:flex-row sm:space-x-2">
            <div>
              <Link href={`/list/${shoppingList.slug}`}>
                <div>
                  <h2 className="text-base font-semibold sm:text-lg">
                    {shoppingList.name}
                  </h2>
                  <div className="line-clamp-3 pb-4">
                    <p className="text-sm text-gray-500 sm:text-base">
                      {shoppingList.description}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="mt-1 flex gap-1 sm:mt-2 sm:gap-2">
                {collaborators.slice(0, 3).map((c, index) => (
                  <Badge key={index}>{c.user.name}</Badge>
                ))}
                {collaborators.length > 3 && (
                  <Badge variant={"outline"}>
                    +{collaborators.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div>
            <ShareDialog
              slug={shoppingList.slug}
              owner={owner}
              collaborators={collaborators}
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
