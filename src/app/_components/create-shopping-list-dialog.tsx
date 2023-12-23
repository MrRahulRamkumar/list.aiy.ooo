"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";
import * as z from "zod";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name must be at least 1 character",
    })
    .max(255, {
      message: "Name must be less than 255 characters",
    }),
  description: z
    .string()
    .min(1, {
      message: "Description must be at least 1 character",
    })
    .max(255, {
      message: "Description must be less than 255 characters",
    }),
});

interface CreateShoppingListFormProps {
  className?: string;
  setOpen: (open: boolean) => void;
}
function CreateShoppingListForm({
  setOpen,
  className,
}: CreateShoppingListFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const createShoppingList = api.shoppingList.createShoppingList.useMutation({
    onSuccess: () => {
      router.refresh();
      setOpen(false);
      toast({
        title: "Hey yoo!",
        description: "Shopping list created!",
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createShoppingList.mutate(values);
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="🎄 Christmas Shopping List" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Christmas gifts for the family"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={createShoppingList.isLoading}
          className="w-full"
          type="submit"
        >
          {createShoppingList.isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {createShoppingList.isLoading && "Creating..."}
          {!createShoppingList.isLoading && "Create List"}
        </Button>
      </form>
    </Form>
  );
}

export function CreateShoppingListDialog() {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add item</DialogTitle>
          </DialogHeader>
          <CreateShoppingListForm setOpen={setOpen} />
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
        <Button variant="outline">
          <Plus className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create List</DrawerTitle>
        </DrawerHeader>
        <CreateShoppingListForm className="px-4" setOpen={setOpen} />
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Plus className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full">
        <SheetHeader>
          <SheetTitle>Create List</SheetTitle>
        </SheetHeader>
        <CreateShoppingListForm setOpen={setOpen} />
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
