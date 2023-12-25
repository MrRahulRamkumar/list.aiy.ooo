"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { useContext, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSocket } from "@/lib/hooks";
import { NEW_ITEM_CHANNEL } from "@/lib/constants";
import { ListPageContext } from "@/lib/list-page-context";

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
  className?: string;
  shoppingListId: number;
  setOpen: (open: boolean) => void;
}
function AddToShoppingListForm({
  shoppingListId,
  setOpen,
  className,
}: AddToShoppingListFormProps) {
  const context = useContext(ListPageContext);

  const addToShoppingList = api.shoppingList.addShoppingListItem.useMutation({
    onSuccess: (item) => {
      setOpen(false);
      context?.socket?.emit(NEW_ITEM_CHANNEL, { item });
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
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
                <Input type="number" placeholder="-" {...field} />
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
              <Select
                disabled={form.getValues("quantity") === undefined}
                required={form.getValues("quantity") !== undefined}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="ml">mL</SelectItem>
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
  shoppingListId: number;
}
export function AddToShoppingListDialog({
  shoppingListId,
}: AddToShoppingListDialogProps) {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add item</DialogTitle>
            <DialogDescription>
              Fill in the details of the item you want to add to your shopping
              list.
            </DialogDescription>
          </DialogHeader>
          <AddToShoppingListForm
            setOpen={setOpen}
            shoppingListId={shoppingListId}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost">
          <Plus className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add item</DrawerTitle>
          <DrawerDescription>
            Fill in the details of the item you want to add to your shopping
            list.
          </DrawerDescription>
        </DrawerHeader>
        <AddToShoppingListForm
          className="px-4"
          setOpen={setOpen}
          shoppingListId={shoppingListId}
        />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
