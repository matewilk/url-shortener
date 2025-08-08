import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, BarChart3, Calendar, Trash2 } from "lucide-react";

const urls = [
  {
    id: 1,
    originalUrl: "https://www.example.com/very-long-article-about-technology",
    shortUrl: "https://short.ly/abc123",
    clicks: 1247,
    createdAt: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    originalUrl: "https://github.com/user/awesome-project",
    shortUrl: "https://short.ly/def456",
    clicks: 892,
    createdAt: "2024-01-10",
    status: "active",
  },
  {
    id: 3,
    originalUrl: "https://docs.google.com/presentation/d/1234567890",
    shortUrl: "https://short.ly/ghi789",
    clicks: 456,
    createdAt: "2024-01-05",
    status: "active",
  },
];

const ProfilePage = () => {
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  return (
    <div className="w-full max-w-5xl mx-auto mt-12">
      <div className="m-8">
        <Card className="max-w-4xl mx-auto mb-8 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">John Doe</h1>
                <p className="text-gray-600">john.doe@example.com</p>
                <Badge variant="secondary" className="mt-2">
                  Basic Member
                </Badge>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {urls.length}
                </div>
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
          </CardContent>
        </Card>

        <Card className="max-w-4xl mx-auto shadow-lg">
          <Tabs defaultValue="links" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="links">My Links</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="links">
              <CardContent>
                <div className="space-y-4">
                  {urls.map((url) => (
                    <Card key={url.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg text-blue-600">
                                {url.shortUrl}
                              </h3>
                              <a>
                                <Copy className="h-4 w-4" />
                              </a>
                              <a>
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                            <p className="text-gray-600 text-sm truncate mb-2">
                              {url.originalUrl}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <BarChart3 className="h-4 w-4" />
                                <span>
                                  {url.clicks.toLocaleString()} clicks
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Created {url.createdAt}</span>
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
              </CardContent>
            </TabsContent>

            <TabsContent value="analytics">
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Analytics Dashboard
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Detailed analytics and insights for your shortened URLs will
                    appear here.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Click Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-center justify-center">
                          <span className="text-blue-600">
                            Chart Coming Soon
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Geographic Data
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-32 bg-gradient-to-r from-green-100 to-green-200 rounded flex items-center justify-center">
                          <span className="text-green-600">
                            Map Coming Soon
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
