import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddToShoppingListDialog } from "@/app/_components/add-to-shopping-list";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
import { Loading } from "@/app/_components/loading";
import { ListDropdownMenu } from "@/app/_components/list-drop-down-menu";
import { Loader2 } from "lucide-react";
import { formatDistance } from "date-fns";
import {
  type SelectShoppingListItem,
  type SelectUser,
} from "@/server/db/schema";
import { useSession } from "next-auth/react";

interface ListProps {
  slug: string;
}

export function List({ slug }: ListProps) {
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
              <ul className="-my-5 divide-y divide-gray-200">
                {shoppingList.items.map((item) => {
                  return (
                    <ListItem
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ListItemProps {
  slug: string;
  item: SelectShoppingListItem;
  createdBy: SelectUser;
  completedBy?: SelectUser | null;
}

function ListItem({ slug, item, completedBy, createdBy }: ListItemProps) {
  const utils = api.useUtils();
  const session = useSession();

  const completeShoppingListItem =
    api.shoppingList.completeShoppingListItem.useMutation({
      onSuccess: () => {
        void utils.shoppingList.getShoppingList.invalidate(slug);
      },
    });

  return (
    <li key={item.id} className="flex justify-between gap-x-6 py-5">
      <div className="flex gap-x-4">
        <div className="flex items-center justify-center">
          {completeShoppingListItem.isLoading && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {!completeShoppingListItem.isLoading && (
            <Checkbox
              checked={!!item.completedAt}
              onClick={() => {
                completeShoppingListItem.mutate(item.id);
              }}
            />
          )}
        </div>

        <div className="min-w-0 flex-auto">
          <span className="block">
            <span className="text-sm font-medium text-gray-900">
              {`${item.name}${
                item.quantity ? ` (${item.quantity} ${item.unit})` : ""
              }`}
            </span>
            <span className="text-sm text-gray-500">
              <br />
              {"Added by "}
              <Link
                className="font-medium text-indigo-600 hover:text-indigo-500"
                href="#"
              >
                {createdBy.id === session.data?.user?.id && "You"}
                {createdBy.id !== session.data?.user?.id &&
                  createdBy.name?.split(" ")[0]}
              </Link>
              <br />
              {completedBy && (
                <div>
                  {"Completed by "}
                  <Link
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                    href="#"
                  >
                    {completedBy.id === session.data?.user?.id && "You"}
                    {completedBy.id !== session.data?.user?.id &&
                      completedBy.name?.split(" ")[0]}
                  </Link>
                  {item.completedAt &&
                    ` ${formatDistance(item.completedAt, new Date(), {
                      addSuffix: true,
                    })}`}
                </div>
              )}
            </span>
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center">
        <ListDropdownMenu />
      </div>
    </li>
  );
}
