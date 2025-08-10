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

  const { data, error } = await capabilities.apiClient.GET(`/{shortUrl}`, {
    params: { path: { shortUrl: hash } },
  });

  if (data?.url) {
    redirect(data?.url);
  }

  return (
    <div className="flex items-center justify-center w-full flex-1">
      <div className="w-full max-w-5xl m-8">
        {error && !data && <UrlNotFoundCard />}
      </div>
    </div>
  );
});
