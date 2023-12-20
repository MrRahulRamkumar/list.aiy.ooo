import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { ShareDialog } from "./share-dialog";
import CreateShoppingListDialog from "./create-shopping-list-dialog";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const owner = {
  id: "99",
  name: "Rahul",
  email: "rahul@exmaple.com",
  image: "https://picsum.photos/640/360",
};

const collaborators = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    image: "https://picsum.photos/640/360",
    isOwner: true,
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@example.com",
    image: "https://picsum.photos/640/360",
  },
  {
    id: "3",
    name: "Charlie",
    email: "charlie@example.com",
    image: "https://picsum.photos/640/360",
  },
  {
    id: "4",
    name: "Alice",
    email: "alice@example.com",
    image: "https://picsum.photos/640/360",
  },
  {
    id: "5",
    name: "Bob",
    email: "bob@example.com",
    image: "https://picsum.photos/640/360",
  },
  {
    id: "6",
    name: "Charlie",
    email: "charlie@example.com",
    image: "https://picsum.photos/640/360",
  },
  {
    id: "7",
    name: "Alice",
    email: "alice@example.com",
    image: "https://picsum.photos/640/360",
  },
  {
    id: "8",
    name: "Bob",
    email: "bob@example.com",
    image: "https://picsum.photos/640/360",
  },
  {
    id: "9",
    name: "Charlie",
    email: "charlie@example.com",
    image: "https://picsum.photos/640/360",
  },
];

const shoppingLists = [
  {
    id: "1",
    name: "Groceries",
    owner,
    collaborators,
  },
  {
    id: "2",
    name: "Christmas Shopping",
    owner,
    collaborators,
  },
  {
    id: "3",
    name: "Birthday Shopping",
    owner,
    collaborators,
  },
];

export function ShoppingList() {
  return (
    <>
      <main className="w-full py-4 sm:py-6 md:py-12">
        <div className="container mx-auto grid max-w-sm gap-4 px-2 sm:max-w-md sm:gap-6 sm:px-4 md:max-w-xl md:gap-8 md:px-6 lg:max-w-none">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4 md:gap-8">
            <div className="grid gap-1">
              <div className="flex-cols flex">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                  Your Lists
                </h1>
                <Link className="px-1" href={"/api/auth/signout"}>
                  <Button variant="ghost">
                    <LogOut className="h-6 w-6" />
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                Manage your shopping lists and collaborate with others.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:gap-6 md:gap-8">
            {shoppingLists.map((sl) => {
              return <ShoppingListItem shoppingList={sl} />;
            })}
          </div>
        </div>
        <div className="flex items-center justify-center p-4">
          <CreateShoppingListDialog />
        </div>
      </main>
    </>
  );
}

interface ShoppingListItemProps {
  shoppingList: {
    id: string;
    name: string;
    description?: string;
    owner: {
      id: string;
      name: string;
      email: string;

      image?: string;
    };
    collaborators: {
      id: string;
      name: string;
      email: string;
      image?: string;
    }[];
  };
}

export function ShoppingListItem({ shoppingList }: ShoppingListItemProps) {
  return (
    <Card key={shoppingList.id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center space-x-1 sm:flex-row sm:space-x-2">
            <div>
              <Link href={`/list/${shoppingList.id}`}>
                <div>
                  <h2 className="text-base font-semibold sm:text-lg">
                    {shoppingList.name}
                  </h2>
                  <div className="line-clamp-3 pb-4">
                    <p className="text-sm text-gray-500 sm:text-base">
                      {shoppingList.description}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="mt-1 flex gap-1 sm:mt-2 sm:gap-2">
                {shoppingList.collaborators.slice(0, 3).map((c, index) => (
                  <Badge key={index}>{c.name}</Badge>
                ))}
                {shoppingList.collaborators.length > 3 && (
                  <Badge variant={"outline"}>
                    +{shoppingList.collaborators.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div>
            <ShareDialog
              owner={shoppingList.owner}
              collaborators={shoppingList.collaborators}
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
