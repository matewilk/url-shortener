import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AlertTriangleIcon } from "./AlertTriangleIcon";
import { CardNavigation } from "./CardNavigation";

export const UrlNotFoundCard = () => {
  return (
    <Card className="shadow-2xl mb-8 p-4">
      <CardHeader className="pb-4 gap-6">
        <div className="flex justify-center">
          <AlertTriangleIcon />
        </div>
        <CardTitle className="text-4xl font-bold text-gray-900 mb-2 text-center">
          Link Not Found
        </CardTitle>
        <p className="text-xl text-gray-600 text-center">
          {`Oops! The shortened URL you're looking for doesn't exist or may have
          expired.`}
        </p>
      </CardHeader>
      <CardContent className="space-y-6 text-xl">
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3 text-center">
            This could happen if:
          </h3>
          <ul className="text-left space-y-2 text-gray-600">
            <li className="flex items-start space-x-2">
              <span className="text-red-500 mt-1">•</span>
              <span>The link was typed incorrectly</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-500 mt-1">•</span>
              <span>The link was deleted by its creator</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-500 mt-1">•</span>
              <span>{`The page you're looking for doesn't exist`}</span>
            </li>
          </ul>
        </div>

        <CardNavigation />
      </CardContent>
    </Card>
  );
};
