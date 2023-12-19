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
        <div className="h-60 space-y-4 overflow-y-scroll rounded-md border border-gray-200 p-2">
          <p className="font-bold">Collaborators</p>
          <ul className="list-none space-y-4">
            <li className="flex items-center justify-between space-x-2 rounded-md p-2 hover:bg-gray-100">
              <div className="flex items-center space-x-2">
                <Avatar>
                  {owner.image && <AvatarImage src={owner.image} />}
                  <AvatarFallback>
                    {owner.name.charAt(0).toLocaleUpperCase()}
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
          </ul>
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
}

export function ShareDialogCollaboratorListItem({
  id,
  name,
  email,
  image,
}: ShareDialogCollaboratorListItemProps) {
  return (
    <li
      key={id}
      className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100"
    >
      <Avatar>
        {image && <AvatarImage src={image} />}
        <AvatarFallback>{name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p>Jane Doe</p>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
    </li>
  );
}
