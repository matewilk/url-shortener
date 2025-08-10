import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export const Analytics = () => {
  return (
    <div className="text-center py-12">
      <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Analytics Dashboard
      </h3>
      <p className="text-gray-500 mb-6">
        Detailed analytics and insights for your shortened URLs will appear
        here.
      </p>
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Click Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-center justify-center">
              <span className="text-blue-600">Chart Coming Soon</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Geographic Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gradient-to-r from-green-100 to-green-200 rounded flex items-center justify-center">
              <span className="text-green-600">Map Coming Soon</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
