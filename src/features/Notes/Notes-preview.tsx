import { NotebookPen } from "lucide-react";

export const NotesPreview = () => (
  <div className="flex flex-col items-center justify-center w-full h-full bg-yellow-100 rounded-md p-2 text-xs">
    {/* <div className="text-2xl mb-1">🗒️</div> */}
    <NotebookPen  className="text-2xl mb-1 text-yellow-400"/>
    <div className="w-3/4 h-1 bg-yellow-400 rounded mb-0.5"></div>
    <div className="w-2/3 h-1 bg-yellow-300 rounded"></div>
  </div>
);
