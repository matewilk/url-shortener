import { CopyToClipBtn } from "@/urls/components/submitUrlForm/CopyToClipBtn";
import { OpenUrlBtn } from "@/urls/components/submitUrlForm/OpenUrlBtn";

type UrlBoxProps = {
  host: string;
  path: string;
  shortUrl: string;
};

export const UrlBox = ({ host, path, shortUrl }: UrlBoxProps) => {
  const url = `${host}/${path}/${shortUrl}`;
  return (
    <div className="flex items-center bg-slate-300 rounded-full px-4 py-2 w-full max-w-screen-md">
      <input
        className="bg-transparent w-full text-black h-8"
        name="url-box"
        type="text"
        value={url}
        aria-label="Url box"
        readOnly
      />
      <div className="flex gap-6 ml-4">
        <CopyToClipBtn url={url} />
        <OpenUrlBtn url={url} />
      </div>
    </div>
  );
};
