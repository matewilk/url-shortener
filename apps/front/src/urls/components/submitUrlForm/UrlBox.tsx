import { CopyToClipBtn } from "@/urls/components/submitUrlForm/CopyToClipBtn";
import { OpenUrlBtn } from "@/urls/components/submitUrlForm/OpenUrlBtn";

type UrlBoxProps = {
  host: string;
  url: string;
};

export const UrlBox = ({ host, url }: UrlBoxProps) => {
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
        <CopyToClipBtn url={fullUrl} />
        <OpenUrlBtn url={fullUrl} />
      </div>
    </div>
  );
};
