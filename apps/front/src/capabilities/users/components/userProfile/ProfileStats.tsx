import { Url } from "@/capabilities/urls/Url";

type Props = {
  urls: Array<Url>;
  totalClicks: number;
};

// TODO: Move to a separate entity - Stats/Analytics?
export const ProfileStats = ({ urls, totalClicks }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{urls.length}</div>
        <div className="text-sm text-gray-600">Total Links</div>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">
          {totalClicks.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">Total Clicks</div>
      </div>
      <div className="text-center p-4 bg-purple-50 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">
          {Math.round(totalClicks / urls.length)}
        </div>
        <div className="text-sm text-gray-600">Avg. Clicks/Link</div>
      </div>
    </div>
  );
};
