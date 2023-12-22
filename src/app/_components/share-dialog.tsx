"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SheetTitle,
  SheetHeader,
  SheetContent,
  Sheet,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { type SelectUser } from "@/server/db/schema";
import { Check, Copy, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface ShareSheetProps {
  slug: string;
  owner: SelectUser;
  collaborators: {
    userId: string;
    shoppingListId: number;
    user: SelectUser;
  }[];
}

export function ShareDialog({ slug, owner, collaborators }: ShareSheetProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Send />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full space-y-4 p-4">
        <SheetHeader>
          <SheetTitle>Share this Shopping List</SheetTitle>
        </SheetHeader>
        <div className="flex items-center space-x-2">
          <Input
            className="w-full"
            id="share-link"
            readOnly
            value={`https://list.aiy.ooo/list/${slug}`}
          />
          <Button
            size="sm"
            variant="outline"
            type="submit"
            onClick={() => {
              void navigator.clipboard.writeText(
                `https://list.aiy.ooo/list/${slug}`,
              );
              toast({
                title: "Hey yoo!",
                description: "Link copied to clipboard!",
                action: <ToastAction altText="Okay">Okay</ToastAction>,
              });
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {!copied && <Copy className="h-4 w-4" />}
            {copied && <Check className="h-4 w-4" />}
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
        <li className="flex items-center justify-between space-x-2 rounded-md p-2 hover:bg-gray-100">
          <div className="flex items-center space-x-2">
            <Avatar>
              {owner.image && <AvatarImage src={owner.image} />}
              <AvatarFallback>
                {owner.name?.charAt(0).toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p>{owner.name}</p>
              <p className="text-sm text-gray-500">{owner.email}</p>
            </div>
          </div>
          <span className="rounded bg-green-500 px-2 py-1 text-xs text-white">
            Owner
          </span>
        </li>
        <p className="text-center text-xl font-bold">Collaborators</p>
        {collaborators.length === 0 && (
          <p className="text-center text-gray-500">
            No collaborators yet. Send the link to people you want to shop with!
          </p>
        )}
        {collaborators.length > 0 && (
          <div className="h-60 space-y-4 overflow-y-scroll rounded-md border border-gray-200 p-2">
            <ul className="list-none space-y-4">
              {collaborators.map((c) => {
                return (
                  <ShareSheetCollaboratorListItem key={c.userId} {...c.user} />
                );
              })}
            </ul>
          </div>
        )}
        <SheetFooter className="sm:justify-start">
          <SheetClose asChild>
            <Button type="button" className="w-full">
              Done
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function ShareSheetCollaboratorListItem({
  name,
  email,
  image,
}: SelectUser) {
  return (
    <li className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100">
      <Avatar>
        {image && <AvatarImage src={image} />}
        <AvatarFallback>{name?.charAt(0).toLocaleUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p>Jane Doe</p>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
    </li>
  );
}
