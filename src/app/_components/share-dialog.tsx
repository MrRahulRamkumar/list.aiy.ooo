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
import { Copy, Send } from "lucide-react";

interface ShareDialogProps {
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

export function ShareDialog({ owner, collaborators }: ShareDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Send />
        </Button>
      </DialogTrigger>
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

interface ShareDialogCollaboratorListItemProps {
  id: string;
  name: string;
  email: string;
  image?: string;
  isOwner?: boolean;
}

export function ShareDialogCollaboratorListItem({
  id,
  name,
  email,
  image,
  isOwner,
}: ShareDialogCollaboratorListItemProps) {
  return (
    <div key={id} className="flex items-center justify-between space-x-2">
      <div className="flex items-center space-x-2">
        <Avatar>
          {image && <AvatarImage src={image} />}
          <AvatarFallback>{name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p>{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
      {isOwner && (
        <span className="rounded bg-green-500 px-2 py-1 text-xs text-white">
          Owner
        </span>
      )}
    </div>
  );
}
