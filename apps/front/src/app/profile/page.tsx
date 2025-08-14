import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Url } from "@/capabilities/urls/Url";
import { ProfileDetails } from "@/capabilities/users/components/userProfile/ProfileDetails";
import { ProfileStats } from "@/capabilities/users/components/userProfile/ProfileStats";
import { UserLinks } from "@/capabilities/users/components/userProfile/UserLinks";
import { Analytics } from "@/capabilities/users/components/userProfile/Analytics";
import { withCapabilities } from "@/capabilities/withCapabilities";
import { redirect } from "next/navigation";

type UrlWithClicks = Url & { clicks: number };

export default withCapabilities(
  async ({
    capabilities: {
      user: { getUser, token },
      apiClient,
    },
  }) => {
    const user = await getUser();
    if (user.kind === "guest") {
      redirect("/login");
    }

    const { data } = await apiClient.GET("/urls", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { urls } = data || { urls: [] };

    const urlWithClicks: Array<UrlWithClicks> = urls.map((url) => ({
      ...url,
      clicks: Math.floor(Math.random() * 1000),
    }));

    const { name, email } = user;
    const totalClicks = urlWithClicks.reduce((sum, url) => sum + url.clicks, 0);
    return (
      <div className="w-full max-w-5xl mx-auto mt-12">
        <div className="m-8">
          <Card className="max-w-4xl mx-auto mb-8 shadow-lg">
            <CardContent className="pt-6">
              <ProfileDetails name={name} email={email} />
              <ProfileStats urls={urlWithClicks} totalClicks={totalClicks} />
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
                  <UserLinks urls={urlWithClicks} />
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
