import { Capabilities } from "@/capabilities/Capabilities";
import { UserProfileDropdown } from "@/capabilities/users/components/UserProfile";
import { LinkIcon } from "lucide-react";

interface HeaderProps {
  capabilities: Capabilities;
}

interface MenuItem {
  title: string;
  href: string;
}

export const Header = async ({ capabilities }: HeaderProps) => {
  const userResult = await capabilities.getUserData();

  const user = userResult.kind === "success" ? userResult.value.user : null;

  const title = "Shortify";
  const menu: Array<MenuItem> = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 text-blue-950 p-4 w-full bg-blue-100">
      <div className="grid grid-cols-3 items-center w-full max-w-7xl mx-auto">
        <a href="/" className="flex items-center">
          <LinkIcon className="min-h-8 min-w-8 text-blue-600" />
          <h1 className="text-3xl font-bold ml-2 justify-self-start hidden md:block">
            {title}
          </h1>
        </a>
        <nav className="flex gap-8 sm:gap-16 items-center justify-center mx-auto">
          {menu.map(({ title, href }, index) => (
            <a
              key={index}
              href={href}
              className="hover:underline hover:underline-offset-4 text-2xl"
            >
              {title}
            </a>
          ))}
        </nav>
        <nav className="flex items-center gap-4 justify-self-end">
          {user ? (
            <UserProfileDropdown userName={user.name} />
          ) : (
            <a
              href="/login"
              className="text-2xl hover:underline hover:underline-offset-4"
            >
              Login
            </a>
          )}
        </nav>
      </div>
    </header>
  );
};
