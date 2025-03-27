import { client } from "@shortify/api-client/client";
import { redirect } from "next/navigation";

const apiClient = client("http://localhost:3001");

type Params = Promise<{
  hash: string;
}>;

export default async function Page(props: { params: Params }) {
  const { hash } = await props.params;

  const { data, error } = await apiClient.GET(`/{shortUrl}`, {
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
