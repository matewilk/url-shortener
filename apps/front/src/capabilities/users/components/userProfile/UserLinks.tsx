import { Url } from "@/capabilities/urls/Url";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, ExternalLink, BarChart3, Calendar, Trash2 } from "lucide-react";

type Props = {
  urls: Array<Url>;
};

export const UserLinks = ({ urls }: Props) => {
  return (
    <div className="space-y-4">
      {urls.map((url) => (
        <Card key={url.id} className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-lg text-blue-600">
                    {`${process.env.NEXT_PUBLIC_URL}/${url.hash}`}
                  </h3>
                  <a>
                    <Copy className="h-4 w-4" />
                  </a>
                  <a>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-gray-600 text-sm truncate mb-2">{url.url}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>{url.clicks.toLocaleString()} clicks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created {new Date(url.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <a className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
