"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DialogTitle,
  DialogHeader,
  DialogContent,
  Dialog,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { type SelectUser } from "@/server/db/schema";
import { Check, Copy, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useMediaQuery } from "usehooks-ts";
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

interface ShareDialogProps {
  className?: string;
  slug: string;
  owner: SelectUser;
  collaborators: {
    userId: string;
    shoppingListId: number;
    user: SelectUser;
  }[];
}

export function ShareDialog({ slug, owner, collaborators }: ShareDialogProps) {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Send />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full space-y-4 p-4">
          <DialogHeader>
            <DialogTitle>Share this Shopping List</DialogTitle>
          </DialogHeader>
          <ShareDialogContent
            slug={slug}
            owner={owner}
            collaborators={collaborators}
          />
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" className="w-full">
                Done
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
        <Button variant="ghost" size="icon">
          <Send />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Share this Shopping List</DrawerTitle>
        </DrawerHeader>
        <ShareDialogContent
          className="px-4"
          slug={slug}
          owner={owner}
          collaborators={collaborators}
        />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button className="w-full">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function ShareDialogContent({
  className,
  slug,
  owner,
  collaborators,
}: ShareDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  return (
    <div className={className}>
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
      <div className="py-4">
        <p className="text-center text-xl font-bold">Owner</p>
        <div className="flex items-center justify-between space-x-2 rounded-md p-2 hover:bg-gray-100">
          <div className="flex items-center space-x-2">
            <Avatar>
              {owner.image && <AvatarImage src={owner.image} />}
              <AvatarFallback>
                {owner.name?.charAt(0).toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="max-w-200">
              <p>{owner.name}</p>
              <p className="text-ellipsis text-sm text-gray-500">
                {owner.email}
              </p>
            </div>
            {/* <span className="rounded bg-green-500 px-2 py-1 text-xs text-white">
            Owner
          </span> */}
          </div>
        </div>
      </div>
      <div className="py-2">
        <p className="text-center text-xl font-bold">Collaborators</p>
        {collaborators.length === 0 && (
          <p className="py-2 text-center text-sm text-gray-500">
            No collaborators yet. Send the link to people you want to shop with!
          </p>
        )}
        {collaborators.length > 0 && (
          <div className="h-60 space-y-4 overflow-y-scroll rounded-md border border-gray-200 p-2">
            <ul className="list-none space-y-4">
              {collaborators.map((c) => {
                return (
                  <ShareDialogCollaboratorListItem key={c.userId} {...c.user} />
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function ShareDialogCollaboratorListItem({
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
