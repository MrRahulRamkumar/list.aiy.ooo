"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, Trash } from "lucide-react";
import { api } from "@/trpc/react";
import { useContext, useState } from "react";
import { ListPageContext } from "@/lib/list-page-context";
import { DELETE_ITEM_CHANEL } from "@/lib/constants";

interface ListDropdownMenuProps {
  shoppingListSlug: string;
  shoppingListItemId: number;
}
export function ListDropdownMenu({
  shoppingListSlug,
  shoppingListItemId,
}: ListDropdownMenuProps) {
  const context = useContext(ListPageContext);

  const [open, setOpen] = useState(false);
  const deleteShoppingListItem =
    api.shoppingList.deleteShoppingListItem.useMutation({
      onSuccess: () => {
        context?.socket?.emit(DELETE_ITEM_CHANEL, {
          shoppingListSlug,
          shoppingListItemId,
        });
      },
    });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <Button variant="ghost">
          {deleteShoppingListItem.isLoading && (
            <Loader2 className="animate-spin" />
          )}
          {!deleteShoppingListItem.isLoading && <MoreVertical />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            setOpen(false);
            void deleteShoppingListItem.mutate(shoppingListItemId);
          }}
        >
          <Trash className="mr-2 h-4 w-4 text-red-500" />
          <span className="text-red-500">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
