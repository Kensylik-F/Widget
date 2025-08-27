import type { FC } from "react";

export type WidgetItem = {
  id: string;
  name: string;
  cost: number; 
  component: FC;
  preview: FC;
};

