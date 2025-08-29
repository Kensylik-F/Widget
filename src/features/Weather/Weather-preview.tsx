import { CloudSun } from "lucide-react";

export const WeatherPreview = () => (
  <div className="flex flex-col items-center justify-center w-full h-full bg-red-100 rounded-md p-2 text-xs">
    <CloudSun className="text-2xl  mb-1 text-red-500"/>
    <div className="w-3/4 h-1 bg-red-400 rounded mb-0.5"></div>
    <div className="w-2/3 h-1 bg-red-300 rounded"></div>
  </div>
);