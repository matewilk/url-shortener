interface MenuItem {
  title: string;
  href: string;
}

export const Header = () => {
  const title = "Shortify";
  const menu: Array<MenuItem> = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Login", href: "/login" },
  ];
  return (
    <header className="sticky top-0 text-white p-4 w-full">
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between w-full">
        <h1 className="text-3xl font-bold ml-6 sm:absolute">{title}</h1>
        <nav className="flex gap-8 sm:gap-16 items-center justify-center mx-auto sm:relative">
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
      </div>
    </header>
  );
};
