"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { List } from "@/app/_components/list";
import { useSession } from "next-auth/react";
import { Loading } from "@/app/_components/loading";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import { useContext, useEffect } from "react";
import { ListPageContext } from "@/lib/list-page-context";
import { type SelectShoppingListItemWithRelations } from "@/server/db/schema";
import {
  NEW_ITEM_CHANNEL,
  COMPLETE_ITEM_CHANNEL,
  DELETE_ITEM_CHANEL,
} from "@/lib/constants";

export default function Page({ params }: { params: { slug: string } }) {
  const utils = api.useUtils();
  const slug = params.slug;
  const session = useSession();
  const context = useContext(ListPageContext);

  useEffect(() => {
    context?.socket?.on("connect", () => {
      console.log("connected to socket", context?.socket?.id);
    });

    context?.socket?.on(
      NEW_ITEM_CHANNEL,
      (payload: { item: SelectShoppingListItemWithRelations }) => {
        console.log("new item", payload);
        utils.shoppingList.getShoppingList.setData(slug, (prevShoppingList) => {
          if (!prevShoppingList) {
            return prevShoppingList;
          }

          const items = [
            {
              ...payload.item,
              updatedAt: new Date(payload.item.updatedAt),
              createdAt: new Date(payload.item.createdAt),
            },
            ...prevShoppingList.items,
          ];

          return {
            ...prevShoppingList,
            items: items,
          };
        });
      },
    );

    context?.socket?.on(
      COMPLETE_ITEM_CHANNEL,
      (payload: { item: SelectShoppingListItemWithRelations }) => {
        console.log("complete item", payload);
        utils.shoppingList.getShoppingList.setData(slug, (prevShoppingList) => {
          if (!prevShoppingList) {
            return prevShoppingList;
          }

          const items = prevShoppingList.items
            .map((item) => {
              if (item.id === payload.item.id) {
                return {
                  ...payload.item,
                  createdAt: new Date(payload.item.createdAt),
                  updatedAt: new Date(payload.item.updatedAt),
                  completedAt: payload.item.completedAt
                    ? new Date(payload.item.completedAt)
                    : null,
                };
              }
              return item;
            })
            .sort((a, b) => {
              if (a.completedAt && !b.completedAt) {
                return 1;
              }
              if (b.completedAt && !a.completedAt) {
                return -1;
              }
              if (a.completedAt && b.completedAt) {
                return a.completedAt.getTime() - b.completedAt.getTime();
              }

              return b.createdAt.getTime() - a.createdAt.getTime();
            });

          return {
            ...prevShoppingList,
            items: items,
          };
        });
      },
    );

    context?.socket?.on(
      DELETE_ITEM_CHANEL,
      (payload: { shoppingListItemId: number }) => {
        console.log("delete item", payload);
        utils.shoppingList.getShoppingList.setData(slug, (prevShoppingList) => {
          if (!prevShoppingList) {
            return prevShoppingList;
          }

          const items = prevShoppingList.items.filter((item) => {
            return item.id !== payload.shoppingListItemId;
          });

          return {
            ...prevShoppingList,
            items: items,
          };
        });
      },
    );
  }, [context?.socket]);

  if (session.status === "loading") {
    return (
      <div>
        <Link href="/">
          <Button className="mb-2 mt-4" variant="ghost">
            <ChevronLeft className="h-8 w-8" />
          </Button>
        </Link>
        <Separator />
        <Loading />
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    redirect(`/signIn?slug=${params.slug}`);
  }

  return (
    <div>
      <Link href="/">
        <Button className="mb-2 mt-4" variant="ghost">
          <ChevronLeft className="h-8 w-8" />
        </Button>
      </Link>
      <Separator />
      <List slug={slug} />
    </div>
  );
}
