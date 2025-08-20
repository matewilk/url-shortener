import { redirect } from "next/navigation";

import { withCapabilities } from "@/capabilities/withCapabilities";
import { Capabilities } from "@/capabilities/Capabilities";
import { UrlNotFoundCard } from "@/capabilities/urls/components/urlNotFound/UrlNotFoundCard";

type Params = {
  hash: string;
};

type PageProps = {
  params: Promise<Params>;
  capabilities: Capabilities;
};

export default withCapabilities(async ({ params, capabilities }: PageProps) => {
  const { hash } = await params;

  const url = await capabilities.urls.get(hash);

  if (url) {
    redirect(url);
  }

  return (
    <div className="flex items-center justify-center w-full flex-1">
      <div className="w-full max-w-5xl m-8">{!url && <UrlNotFoundCard />}</div>
    </div>
  );
});
