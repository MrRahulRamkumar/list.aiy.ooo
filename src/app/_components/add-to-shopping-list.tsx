import { Button } from "@/components/ui/button";
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
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";

export default function AddToShoppingList() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Plus className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Add Item</SheetTitle>
          <SheetDescription>
            Fill in the details of the item you want to add to your shopping
            list.
          </SheetDescription>
        </SheetHeader>
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
      </SheetContent>
    </Sheet>
  );
}
