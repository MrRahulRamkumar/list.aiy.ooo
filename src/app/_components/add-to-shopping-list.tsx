/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Bqf370qXIFs
 */
import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function AddToShoppingList() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
          <DialogDescription>
            Fill in the details of the item you want to add to your shopping
            list.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="grid items-center gap-2">
            <Label className="text-base" htmlFor="itemName">
              Item Name
            </Label>
            <Input id="itemName" placeholder="Enter item name" />
          </div>
          <div className="grid items-center gap-2">
            <Label className="text-base" htmlFor="quantity">
              Quantity
            </Label>
            <Input defaultValue="1" id="quantity" min="1" type="number" />
          </div>
          <div className="grid items-center gap-2">
            <Label className="text-base" htmlFor="unit">
              Unit
            </Label>
            <Select defaultValue="kg">
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kg</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="mL">mL</SelectItem>
                <SelectItem value="pcs">Pcs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-end gap-4 pt-8">
            <Button className="w-full" size="lg">
              Add
            </Button>
            <Button className="w-full" size="lg" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
