"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function CreateShoppingListDialog() {
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
            <Input id="listName" placeholder="Christmas Shopping" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="listDescription">Description</Label>
            <Input
              id="listDescription"
              placeholder="Christmas gifts for friends and family"
            />
          </div>
        </div>
        <SheetFooter>
          <Button className="w-full" type="submit">
            Create List
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
