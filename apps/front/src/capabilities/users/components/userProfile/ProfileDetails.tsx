import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const ProfileDetails = () => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-20 w-20">
        <AvatarImage src="/placeholder.svg?height=80&width=80" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">John Doe</h1>
        <p className="text-gray-600">john.doe@example.com</p>
        <Badge variant="secondary" className="mt-2">
          Basic Member
        </Badge>
      </div>
    </div>
  );
};
