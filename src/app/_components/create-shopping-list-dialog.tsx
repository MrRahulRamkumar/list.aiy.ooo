"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function CreateShoppingListDialog() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const createShoppingList = api.shoppingList.createShoppingList.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setDescription("");
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Plus className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Create List</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="listName">List Name</Label>
            <Input
              id="listName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Christmas Shopping"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="listDescription">Description</Label>
            <Input
              id="listDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Christmas gifts for friends and family"
            />
          </div>
        </div>
        <SheetFooter>
          <div className="grid w-full grid-cols-1 gap-2">
            <Button
              onClick={(e) => {
                createShoppingList.mutate({ name, description });
              }}
              disabled={createShoppingList.isLoading}
              className="w-full"
              type="submit"
            >
              {createShoppingList.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {createShoppingList.isLoading && "Creating..."}
              {!createShoppingList.isLoading && "Creating List"}
            </Button>
            <SheetClose>
              <Button className="w-full" variant="outline">
                Cancel
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
