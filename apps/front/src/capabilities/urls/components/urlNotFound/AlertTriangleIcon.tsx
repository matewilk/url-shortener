import { AlertTriangle } from "lucide-react";

export const AlertTriangleIcon = () => {
  return (
    <div className="relative">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-red-600" />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">!</span>
      </div>
    </div>
  );
};