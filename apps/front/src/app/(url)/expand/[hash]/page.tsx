import { redirect } from "next/navigation";

import { withCapabilities } from "@/capabilities/withCapabilities";
import { Capabilities } from "@/capabilities/Capabilities";

type Params = {
  hash: string;
  capabilites: Capabilities;
};

export default withCapabilities(
  async ({
    params,
    capabilities,
  }: {
    params: Params;
    capabilities: Capabilities;
  }) => {
    const { hash } = params;

    const { data, error } = await capabilities.apiClient.GET(`/{shortUrl}`, {
      params: { path: { shortUrl: hash } },
    });

    if (data?.url) {
      redirect(data?.url);
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl">
          {error && <div>Error</div>}
          {!data?.url && <div>Url not found</div>}
        </div>
      </div>
    );
  }
);
