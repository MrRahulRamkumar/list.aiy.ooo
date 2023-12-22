"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  setOpen: (open: boolean) => void;
}
function CreateShoppingListForm({ setOpen }: CreateShoppingListFormProps) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
