import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="p-4 flex gap-6 flex-wrap items-center justify-center">
      <a
        className="flex items-center gap-1 hover:underline hover:underline-offset-4"
        href="https://github.com/matewilk"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          aria-hidden
          src="https://nextjs.org/icons/globe.svg"
          alt="Globe icon"
          width={16}
          height={16}
        />
        matewilk
      </a>
    </footer>
  );
};
