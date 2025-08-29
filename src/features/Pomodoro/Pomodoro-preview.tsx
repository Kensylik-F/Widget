import { Timer } from "lucide-react";

export const PomodoroPreview = () => (
  <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 rounded-md p-2 text-xs">
    {/* <div className="text-2xl mb-1">⌛</div> */}
    <Timer className="text-2xl mb-1 text-gray-500"/>
  </div>
);