import Link from "next/link";
import { Home, LinkIcon } from "lucide-react";

export const CardNavigation = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link href="/" className="flex items-center space-x-2">
        <Home className="h-5 w-5" />
        <span>Go Home</span>
      </Link>
      <Link href="/" className="flex items-center space-x-2">
        <LinkIcon className="h-5 w-5" />
        <span>Create New Link</span>
      </Link>
    </div>
  );
};
