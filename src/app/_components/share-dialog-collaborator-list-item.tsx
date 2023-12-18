import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
