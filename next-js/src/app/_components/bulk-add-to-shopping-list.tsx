"use client";

import { Button } from "@/components/ui/button";
import { ListPlus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { useContext, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { NEW_ITEM_CHANNEL } from "@/lib/constants";
import { ListPageContext } from "@/lib/list-page-context";
import { Textarea } from "@/components/ui/text-area";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const formSchema = z.object({
  text: z.string().min(1, {
    message: "Input must be at least 1 character",
  }),
});

interface BulkAddToShoppingListFormProps {
  className?: string;
  shoppingListId: number;
  shoppingListSlug: string;
  setOpen: (open: boolean) => void;
}
function BulkAddToShoppingListForm({
  shoppingListSlug,
  shoppingListId,
  setOpen,
  className,
}: BulkAddToShoppingListFormProps) {
  const context = useContext(ListPageContext);
  const { toast } = useToast();

  const bulkAddToShoppingList =
    api.shoppingList.bulkAddShoppingListItem.useMutation({
      onSuccess: (items) => {
        setOpen(false);
        toast({
          title: "Hey yoo!",
          description: `${items.length} items added!`,
          action: <ToastAction altText="Okay">Okay</ToastAction>,
        });
        context?.socket?.emit(NEW_ITEM_CHANNEL, {
          shoppingListSlug,
          shoppingListItems: items,
        });
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    bulkAddToShoppingList.mutate({
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
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={`Milk 2 liters
Eggs 12 
Flour 1 kg
Cheese 500 g`}
                  className="h-60 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col justify-end gap-4 pt-8">
          <Button
            disabled={bulkAddToShoppingList.isLoading}
            className="w-full"
            type="submit"
          >
            {bulkAddToShoppingList.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {bulkAddToShoppingList.isLoading && "Adding..."}
            {!bulkAddToShoppingList.isLoading && "Add"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface BulkAddToShoppingListDialogProps {
  shoppingListSlug: string;
  shoppingListId: number;
}
export function BulkAddToShoppingListDialog({
  shoppingListSlug,
  shoppingListId,
}: BulkAddToShoppingListDialogProps) {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <ListPlus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bulk add items</DialogTitle>
            <DialogDescription>
              Just paste your shopping list, we'll take care of the rest! Make
              sure each item is on a new line.
            </DialogDescription>
          </DialogHeader>
          <BulkAddToShoppingListForm
            setOpen={setOpen}
            shoppingListSlug={shoppingListSlug}
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
          <ListPlus className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Bulk add items</DrawerTitle>
          <DrawerDescription>
            Just paste your shopping list, we'll take care of the rest! Make
            sure each item is on a new line.
          </DrawerDescription>
        </DrawerHeader>
        <BulkAddToShoppingListForm
          className="px-4"
          setOpen={setOpen}
          shoppingListSlug={shoppingListSlug}
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
