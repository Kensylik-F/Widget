import { ListTodo } from "lucide-react";

export const ToDoPreview = () => (
  <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 rounded-md p-2 text-xs">
    <ListTodo className="text-gray-500 mb-1 text-2xl"/>
    <div className="w-3/4 h-1 bg-gray-300 rounded mb-0.5"></div>
    <div className="w-2/3 h-1 bg-gray-400 rounded"></div>
  </div>
);
