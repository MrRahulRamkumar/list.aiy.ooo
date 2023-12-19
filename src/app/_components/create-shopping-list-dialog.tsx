/**
 * v0 by Vercel.
 * @see https://v0.dev/t/nl8esF7gGaS
 */
import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export default function CreateShoppingListDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create List</DialogTitle>
        </DialogHeader>
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
        <DialogFooter>
          <Button className="w-full" type="submit">
            Create List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
