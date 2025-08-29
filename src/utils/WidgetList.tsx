import { Calendar, CalendarPreview, Chat, ChatPreview, Notes, NotesPreview, PomodoroPreview, TimerWidget, ToDo, ToDoPreview, Weather, WeatherPreview } from "../features";
import type { WidgetItem } from "../types";

export const widgetList: WidgetItem[] = [
  { id: '1', name: 'ToDo', cost: 2, component: ToDo, preview: ToDoPreview },
  { id: '2', name: 'Weather', cost:  2, component: Weather, preview: WeatherPreview,},
  { id: '3', name: 'Notes', cost: 2, component:  Notes, preview: NotesPreview },
  { id: '4', name: 'Calendar', cost: 1, component: Calendar, preview: CalendarPreview},
  { id: '5', name: 'Pomodoro', cost: 1, component: TimerWidget, preview: PomodoroPreview },
  { id: '6', name: 'Chat', cost: 2, component: Chat, preview: ChatPreview },

];
