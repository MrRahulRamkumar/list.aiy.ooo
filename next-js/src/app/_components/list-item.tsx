import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/trpc/react";
import { ListDropdownMenu } from "@/app/_components/list-drop-down-menu";
import { Loader2 } from "lucide-react";
import { formatDistance } from "date-fns";
import {
  type SelectShoppingListItem,
  type SelectUser,
} from "@/server/db/schema";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { COMPLETE_ITEM_CHANNEL } from "@/lib/constants";
import { ListPageContext } from "@/lib/list-page-context";
import { useContext } from "react";

interface ListItemProps {
  slug: string;
  item: SelectShoppingListItem;
  createdBy: SelectUser;
  completedBy?: SelectUser | null;
}

export function ListItem({
  slug,
  item,
  completedBy,
  createdBy,
}: ListItemProps) {
  const session = useSession();
  const context = useContext(ListPageContext);

  const completeShoppingListItem =
    api.shoppingList.completeShoppingListItem.useMutation({
      onSuccess: (item) => {
        console.log(context?.socket?.id);
        context?.socket?.emit(COMPLETE_ITEM_CHANNEL, { item });
      },
    });

  return (
    <li className="flex justify-between gap-x-6 py-5">
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
            <span
              className={clsx("`text-sm text-gray-900` font-medium", {
                "text-gray-500 line-through": !!item.completedAt,
              })}
            >
              {`${item.name}${
                item.quantity ? ` (${item.quantity} ${item.unit})` : ""
              }`}
            </span>
            <span className="text-sm text-gray-500">
              <br />
              {"Added by "}
              <span className="font-medium text-fuchsia-400">
                {createdBy.id === session.data?.user?.id && "You"}
                {createdBy.id !== session.data?.user?.id &&
                  createdBy.name?.split(" ")[0]}
              </span>
              <br />
              {completedBy && (
                <div>
                  {"Completed by "}
                  <span className="font-medium text-fuchsia-400">
                    {completedBy.id === session.data?.user?.id && "You"}
                    {completedBy.id !== session.data?.user?.id &&
                      completedBy.name?.split(" ")[0]}
                  </span>
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
        <ListDropdownMenu
          shoppingListSlug={slug}
          shoppingListItemId={item.id}
        />
      </div>
    </li>
  );
}
