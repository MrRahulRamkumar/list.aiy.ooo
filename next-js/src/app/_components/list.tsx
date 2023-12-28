import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddToShoppingListDialog } from "@/app/_components/add-to-shopping-list";
import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
import { Loading } from "@/app/_components/loading";
import { ListItem } from "@/app/_components/list-item";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { BulkAddToShoppingListDialog } from "./bulk-add-to-shopping-list";

interface ListProps {
  slug: string;
}

export function List({ slug }: ListProps) {
  const [animationParent] = useAutoAnimate();
  const { data: shoppingList, isLoading } =
    api.shoppingList.getShoppingList.useQuery(slug);

  if (isLoading) {
    return <Loading />;
  }

  if (!shoppingList) {
    redirect("/404");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden rounded-lg shadow">
        <CardHeader className="flex items-center justify-between px-4 py-5 sm:px-6">
          <CardTitle className="text-lg font-medium leading-6 text-gray-900">
            {shoppingList.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="flow-root">
            {shoppingList.items.length === 0 && (
              <p className="text-center text-sm text-gray-500">
                No items yet. Add items to your shopping list by clicking the
                button below
              </p>
            )}
            {shoppingList.items.length > 0 && (
              <ul
                ref={animationParent}
                className="-my-5 divide-y divide-gray-200"
              >
                {shoppingList.items.map((item) => {
                  return (
                    <ListItem
                      key={item.id.toString()}
                      slug={slug}
                      item={item}
                      completedBy={item.completedBy}
                      createdBy={item.createdBy}
                    />
                  );
                })}
              </ul>
            )}
          </div>
          <br />
          <div className="flex items-center justify-center p-4">
            <AddToShoppingListDialog
              shoppingListSlug={slug}
              shoppingListId={shoppingList.id}
            />
            <BulkAddToShoppingListDialog
              shoppingListSlug={slug}
              shoppingListId={shoppingList.id}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
