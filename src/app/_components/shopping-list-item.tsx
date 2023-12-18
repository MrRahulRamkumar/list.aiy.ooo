"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Send } from "lucide-react";

interface ShoppingListItemProps {
  setOpenShareDialog: (isOpen: boolean) => void;
  shoppingList: {
    id: string;
    name: string;
  };
  collaborators: {
    name: string;
    email: string;
    image?: string;
  }[];
}

export function ShoppingListItem({
  setOpenShareDialog,
  shoppingList,
  collaborators,
}: ShoppingListItemProps) {
  return (
    <Card key={shoppingList.id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center space-x-1 sm:flex-row sm:space-x-2">
            <div>
              <h2 className="text-base font-semibold sm:text-lg">
                {shoppingList.name}
              </h2>
              <div className="mt-1 flex gap-1 sm:mt-2 sm:gap-2">
                {collaborators.slice(0, 3).map((c, index) => (
                  <Badge key={index}>{c.name}</Badge>
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
            <Button
              onClick={() => setOpenShareDialog(true)}
              variant="ghost"
              size="icon"
            >
              <Send />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
