import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Props = {
  name: string;
  email: string;
  avatarUrl?: string;
};

export const ProfileDetails = ({ name, email, avatarUrl }: Props) => {
  const nameInitials = name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-20 w-20">
        {avatarUrl ? <AvatarImage src={avatarUrl} /> : null}
        <AvatarFallback>{nameInitials}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
        <p className="text-gray-600">{email}</p>
        <Badge variant="secondary" className="mt-2">
          Basic Member
        </Badge>
      </div>
    </div>
  );
};
