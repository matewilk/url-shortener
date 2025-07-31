import { Capabilities } from "@/capabilities/Capabilities";
import { UserProfileDropdown } from "@/capabilities/users/components/UserProfile";

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
    <header className="sticky top-0 text-white p-4 w-full">
      <div className="grid grid-cols-3 items-center w-full">
        <h1 className="text-3xl font-bold ml-6 justify-self-start">{title}</h1>
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
