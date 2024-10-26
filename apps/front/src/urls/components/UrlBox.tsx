import { FC, JSX } from "react";
import { FiShare2, FiExternalLink } from "react-icons/fi";

type UrlBoxProps = {
  host: string;
  url: string;
};

export const UrlBox: FC<UrlBoxProps> = ({ host, url }): JSX.Element => {
  const fullUrl = `${host}/${url}`;
  return (
    <div className="flex items-center bg-slate-300 rounded-full px-4 py-2 w-full max-w-screen-md">
      <input
        className="bg-transparent w-full text-black h-8"
        name="url-box"
        type="text"
        value={fullUrl}
        aria-label="Url box"
        readOnly
      />
      <div className="flex gap-6 ml-4">
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => navigator.clipboard.writeText(fullUrl)}
          aria-label="Copy URL to clipboard"
          type="button"
        >
          <FiShare2 size={20} />
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Open URL in new window"
        >
          <FiExternalLink size={20} />
        </a>
      </div>
    </div>
  );
};
