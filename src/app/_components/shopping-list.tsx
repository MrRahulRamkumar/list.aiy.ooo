"use client";

import { useState } from "react";
import { ShoppingListItem } from "./shopping-list-item";
import { ShareDialog } from "./share-dialog";

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
  const [openShareDialog, setOpenShareDialog] = useState(false);

  return (
    <>
      <ShareDialog
        owner={owner}
        collaborators={collaborators}
        open={openShareDialog}
        setOpen={setOpenShareDialog}
      />
      <main className="w-full py-4 sm:py-6 md:py-12">
        <div className="container mx-auto grid max-w-sm gap-4 px-2 sm:max-w-md sm:gap-6 sm:px-4 md:max-w-xl md:gap-8 md:px-6 lg:max-w-none">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4 md:gap-8">
            <div className="grid gap-1">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                Shopping Lists
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                Manage your shopping lists and collaborate with others.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:gap-6 md:gap-8">
            {shoppingLists.map((sl) => {
              return (
                <ShoppingListItem
                  setOpenShareDialog={setOpenShareDialog}
                  shoppingList={sl}
                  collaborators={sl.collaborators}
                />
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
