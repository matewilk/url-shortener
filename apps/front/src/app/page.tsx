import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, BarChart3 } from "lucide-react";

import { SubmitUrlForm } from "../capabilities/urls/components/submitUrlForm/SubmitUrlForm";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Shorten Your URLs
          <span className="text-blue-600"> Instantly</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create short, memorable links that are perfect for sharing. Track
          clicks, manage your links, and boost your online presence.
        </p>
      </div>
      <SubmitUrlForm />
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <Card className="bg-white shadow-md text-center">
          <CardContent className="pt-6">
            <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Generate shortened URLs in milliseconds with our optimized
              infrastructure.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">
              Your links are protected with enterprise-grade security and 99.9%
              uptime.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analytics Included</h3>
            <p className="text-gray-600">
              Track clicks, locations, and performance with detailed analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
