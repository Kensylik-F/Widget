import { CalendarDays } from "lucide-react";

export const CalendarPreview = () => (
  <div className="flex flex-col items-center justify-center w-full h-full bg-blue-100 rounded-md p-2 text-xs">
    {/* <div className="text-2xl mb-1">📆</div> */}
    <CalendarDays  className="text-2xl mb-1 text-blue-500"/>
    <div className="w-3/4 h-1 bg-blue-400 rounded mb-0.5"></div>
    <div className="w-2/3 h-1 bg-blue-300 rounded"></div>
  </div>
);
