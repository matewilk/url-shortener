interface MenuItem {
  title: string;
  href: string;
}

interface Header {
  title: string;
  menu: Array<MenuItem>;
}

export const Header = () => {
  const title = "Shortify";
  const menu: Array<MenuItem> = [
    { title: "Home", href: "" },
    { title: "About", href: "/about" },
    { title: "Login", href: "/login" },
  ];
  return (
    <header className="sticky top-0 text-white p-4 flex gap-6 items-center justify-between w-full">
      <h1 className="text-3xl font-bold ml-6 absolute">{title}</h1>
      <nav className="flex gap-24 items-center justify-center mx-auto">
        {menu.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="hover:underline hover:underline-offset-4 text-2xl"
          >
            {item.title}
          </a>
        ))}
      </nav>
    </header>
  );
};
