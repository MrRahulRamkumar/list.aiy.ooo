"use client";

import { Button } from "@/components/ui/button";
import {
  DialogTitle,
  DialogHeader,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { ShareDialogCollaboratorListItem } from "./share-dialog-collaborator-list-item";

interface ShareDialogProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
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
}

export function ShareDialog({
  open,
  setOpen,
  owner,
  collaborators,
}: ShareDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="space-y-4 p-4">
        <DialogHeader>
          <DialogTitle>Share this Shopping List</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            className="w-full"
            id="share-link"
            readOnly
            value="http://example.com/shopping-list"
          />
          <Button size="sm" variant="outline">
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
        <div className="h-60 space-y-2 overflow-y-scroll rounded-md border border-gray-200 p-2">
          <p className="font-bold">Collaborators</p>
          <ShareDialogCollaboratorListItem
            id={owner.id}
            name={owner.name}
            email={owner.email}
            image={owner.image}
            isOwner
          />
          {collaborators.map((c) => {
            return (
              <ShareDialogCollaboratorListItem
                id={c.id}
                name={c.name}
                email={c.email}
                image={c.image}
              />
            );
          })}
        </div>
        <Button onClick={() => setOpen(false)} className="w-full">
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
}
