import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Url } from "@/capabilities/urls/Url";
import { ProfileDetails } from "@/capabilities/users/components/userProfile/ProfileDetails";
import { ProfileStats } from "@/capabilities/users/components/userProfile/ProfileStats";
import { UserLinks } from "@/capabilities/users/components/userProfile/UserLinks";
import { Analytics } from "@/capabilities/users/components/userProfile/Analytics";
import { withCapabilities } from "@/capabilities/withCapabilities";
import { redirect } from "next/navigation";

const urls: Array<Url> = [
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

export default withCapabilities(
  async ({
    capabilities: {
      user: { getUser },
    },
  }) => {
    const user = await getUser();
    if (user.kind === "guest") {
      redirect("/login");
    }

    const { name, email } = user;
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    return (
      <div className="w-full max-w-5xl mx-auto mt-12">
        <div className="m-8">
          <Card className="max-w-4xl mx-auto mb-8 shadow-lg">
            <CardContent className="pt-6">
              <ProfileDetails name={name} email={email} />
              <ProfileStats urls={urls} totalClicks={totalClicks} />
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
                  <UserLinks urls={urls} />
                </CardContent>
              </TabsContent>

              <TabsContent value="analytics">
                <CardContent>
                  <Analytics />
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    );
  }
);
