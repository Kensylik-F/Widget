import { Timer } from "lucide-react";

export const PomodoroPreview = () => (
  <div className="flex flex-col items-center justify-center w-full h-full bg-green-100 rounded-md p-2 text-xs">
    {/* <div className="text-2xl mb-1">⌛</div> */}
    <Timer className="text-2xl mb-1 text-green-500"/>
    <div className="w-3/4 h-1 bg-green-400 rounded mb-0.5"></div>
    <div className="w-2/3 h-1 bg-green-300 rounded"></div>
  </div>
);