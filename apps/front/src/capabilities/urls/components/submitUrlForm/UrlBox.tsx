import { CopyToClipBtn } from "@/capabilities/urls/components/submitUrlForm/CopyToClipBtn";
import { OpenUrlBtn } from "@/capabilities/urls/components/submitUrlForm/OpenUrlBtn";

type UrlBoxProps = {
  host: string;
  shortUrl: string;
};

export const UrlBox = ({ host, shortUrl }: UrlBoxProps) => {
  const url = `${host}/${shortUrl}`;
  return (
    <div className="flex items-center bg-green-200 rounded-xl px-4 py-2 w-full max-w-screen-md">
      <div className="flex flex-col w-full">
        <div className="flex w-full">
          <span className="text-green-800">Your shortened URL:</span>
        </div>
        <hr className="my-2 border-green-400" />
        <div className="flex flex-row items-center">
          <div className="bg-transparent w-full text-slate-800 h-8">
            <span className="text-lg" data-testid="shortened-url">
              {url}
            </span>
          </div>
          <div className="flex gap-4">
            <CopyToClipBtn url={url} />
            <OpenUrlBtn url={url} />
          </div>
        </div>
      </div>
    </div>
  );
};
