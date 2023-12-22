import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { api } from "@/trpc/react";
import { ListDropdownMenu } from "@/app/_components/list-drop-down-menu";
import { Loader2 } from "lucide-react";
import { formatDistance } from "date-fns";
import {
  type SelectShoppingListItem,
  type SelectUser,
} from "@/server/db/schema";
import { useSession } from "next-auth/react";

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
