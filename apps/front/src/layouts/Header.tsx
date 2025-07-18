import { Capabilities } from "@/capabilities/Capabilities";

interface HeaderProps {
  capabilities: Capabilities;
}

interface MenuItem {
  title: string;
  href?: string;
  action?: () => void;
}

export const Header = async ({ capabilities }: HeaderProps) => {
  const userResult = await capabilities.getUserData({}, capabilities);
  const logoutHandler = capabilities.logoutUserAction;

  const title = "Shortify";
  const menu: Array<MenuItem> = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    ...(userResult.kind === "success" && userResult.value.user.name
      ? [
          { title: `Hi, ${userResult.value.user.name}`, href: "/profile" },
          { title: "Logout", action: logoutHandler },
        ]
      : [{ title: "Login", href: "/login" }]),
  ];

  return (
    <header className="sticky top-0 text-white p-4 w-full">
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between w-full">
        <h1 className="text-3xl font-bold ml-6 sm:absolute">{title}</h1>
        <nav className="flex gap-8 sm:gap-16 items-center justify-center mx-auto sm:relative">
          {menu.map(({ title, href, action }, index) =>
            href ? (
              <a
                key={index}
                href={href}
                className="hover:underline hover:underline-offset-4 text-2xl"
              >
                {title}
              </a>
            ) : action ? (
              <button
                key={index}
                onClick={action}
                className="hover:underline hover:underline-offset-4 text-2xl"
              >
                {title}
              </button>
            ) : null
          )}
        </nav>
      </div>
    </header>
  );
};
