import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { ShareShoppingList } from "@/app/_components/share-shopping-list";
import { CreateShoppingList } from "@/app/_components/create-shopping-list";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { type SelectShoppingListWithRelations } from "@/server/db/schema";

interface ShoppingListProps {
  type: "owner" | "collaborator";
}
export async function ShoppingList({ type }: ShoppingListProps) {
  let shoppingLists;
  if (type === "owner") {
    shoppingLists = await api.shoppingList.getYourShoppingLists.query();
  } else {
    shoppingLists =
      await api.shoppingList.getCollaboratingShoppingLists.query();
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8">
          <div className="grid gap-1">
            <div className="flex-cols flex justify-between pb-8">
              <div className="flex flex-row items-end justify-between">
                {type === "owner" && <CreateShoppingList />}
                <Link href={"/api/auth/signout"}>
                  <Button variant="ghost">
                    <LogOut className="h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {shoppingLists.length === 0 && (
          <div className="flex items-center justify-center p-4">
            <p className="text-md text-gray-500">No shopping lists</p>
          </div>
        )}
        {shoppingLists.length > 0 && (
          <div className="grid gap-4 sm:gap-6 md:gap-8">
            {shoppingLists.map((sl) => {
              return (
                <ShoppingListItem key={sl.id.toString()} shoppingList={sl} />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

interface ShoppingListItemProps {
  shoppingList: SelectShoppingListWithRelations;
}

export function ShoppingListItem({ shoppingList }: ShoppingListItemProps) {
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
                {shoppingList.collaborators.slice(0, 3).map((c, index) => (
                  <Badge key={index}>{c.name?.split(" ")[0]}</Badge>
                ))}
                {shoppingList.collaborators.length > 3 && (
                  <Badge variant={"outline"}>
                    +{shoppingList.collaborators.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div>
            <ShareShoppingList
              slug={shoppingList.slug}
              createdBy={shoppingList.createdBy}
              collaborators={shoppingList.collaborators}
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
