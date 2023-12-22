"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { useState } from "react";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name must be at least 1 character",
    })
    .max(255, {
      message: "Name must be less than 255 characters",
    }),
  quantity: z.coerce
    .number({
      invalid_type_error: "Quantity must be a number",
    })
    .min(1, {
      message: "Quantity must be at least 1",
    })
    .optional(),
  unit: z.enum(["kg", "g", "L", "ml", "pcs"]).optional(),
});

interface AddToShoppingListFormProps {
  shoppingListSlug: string;
  shoppingListId: number;
  setOpen: (open: boolean) => void;
}
function AddToShoppingListForm({
  shoppingListSlug,
  shoppingListId,
  setOpen,
}: AddToShoppingListFormProps) {
  const utils = api.useUtils();
  const addToShoppingList = api.shoppingList.addShoppingListItem.useMutation({
    onSuccess: () => {
      setOpen(false);
      void utils.shoppingList.getShoppingList.invalidate(shoppingListSlug);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addToShoppingList.mutate({
      shoppingListId,
      ...values,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item name</FormLabel>
              <FormControl>
                <Input placeholder="Milk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input placeholder="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="mL">mL</SelectItem>
                  <SelectItem value="pcs">Pcs</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col justify-end gap-4 pt-8">
          <Button
            disabled={addToShoppingList.isLoading}
            className="w-full"
            type="submit"
          >
            {addToShoppingList.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {addToShoppingList.isLoading && "Adding..."}
            {!addToShoppingList.isLoading && "Add"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface AddToShoppingListDialogProps {
  shoppingListSlug: string;
  shoppingListId: number;
}
export function AddToShoppingListDialog({
  shoppingListSlug,
  shoppingListId,
}: AddToShoppingListDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Plus className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full">
        <SheetHeader>
          <SheetTitle>Add Item</SheetTitle>
          <SheetDescription>
            Fill in the details of the item you want to add to your shopping
            list.
          </SheetDescription>
        </SheetHeader>
        <AddToShoppingListForm
          setOpen={setOpen}
          shoppingListId={shoppingListId}
          shoppingListSlug={shoppingListSlug}
        />
        <SheetFooter>
          <div className="grid w-full grid-cols-1">
            <SheetClose>
              <Button className="mt-4 w-full" variant="outline">
                Cancel
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
