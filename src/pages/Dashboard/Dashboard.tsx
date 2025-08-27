import { useState } from "react";

import {  motion } from "framer-motion";

import { Plus, X } from "lucide-react";
import type { WidgetItem } from "../../types";
import { widgetList } from "../../utils/WidgetList";
import { WidgetContainer } from "../../components";

const gridRows = 2;
const gridCols = 3;

type Cell = {
  row: number;
  col: number;
  id: string;
};

type PlacedWidget = {
  id: string;
  cells: string[];
  widget: WidgetItem;
};

export default function Dashboard() {
  const [hoveredCells, setHoveredCells] = useState<string[]>([]);
  const [placedWidgets, setPlacedWidgets] = useState<PlacedWidget[]>([]);
  const [activeWidget, setActiveWidget] = useState<WidgetItem | null>(null);

  const grid: Cell[] = [];
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      grid.push({ row, col, id: `${row}-${col}` });
    }
  }
const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    cell: Cell
) => {
    if (!activeWidget) return;

    // Если cost = 1 — всегда выделяем только текущую ячейку
    if (activeWidget.cost === 1) {
        setHoveredCells([cell.id]);
        return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const edgeThresholdX = rect.width * 0.25;  // 25% активная зона слева/справа
    const edgeThresholdY = rect.height * 0.25; // 25% активная зона сверху/снизу

    const targetCells = [cell.id];

    // Левый край → объединяем с соседом слева
    if (offsetX < edgeThresholdX && cell.col > 0) {
        targetCells.push(`${cell.row}-${cell.col - 1}`);
    }
    // Правый край → объединяем с соседом справа
    else if (offsetX > rect.width - edgeThresholdX && cell.col < gridCols - 1) {
        targetCells.push(`${cell.row}-${cell.col + 1}`);
    }
    // Верхний край → объединяем с соседом сверху
    else if (offsetY < edgeThresholdY && cell.row > 0) {
        targetCells.push(`${cell.row - 1}-${cell.col}`);
    }
    // Нижний край → объединяем с соседом снизу
    else if (offsetY > rect.height - edgeThresholdY && cell.row < gridRows - 1) {
        targetCells.push(`${cell.row + 1}-${cell.col}`);
    }

    // Если кол-во выделенных ячеек превышает cost — режем до лимита
    if (targetCells.length > activeWidget.cost) {
        targetCells.length = activeWidget.cost;
    }

    setHoveredCells(targetCells);
};


  const clearHover = () => {
    setHoveredCells([]);
  };

const handlePlaceWidget = () => {
    if (!activeWidget || hoveredCells.length === 0) return;

    // Проверка на занятие ячеек другими виджетами
    const occupied = placedWidgets.some((widget) =>
      widget.cells.some((cell) => hoveredCells.includes(cell))
    );
    if (occupied) return;

    // Проверка: не превышаем ли лимит по cost
    if (hoveredCells.length > activeWidget.cost) {
      console.log("Нельзя разместить этот виджет на больше чем " + activeWidget.cost + " ячеек");
      return;
    }

    const newWidget: PlacedWidget = {
      id: `widget-${Date.now()}`,
      cells: hoveredCells,
      widget: activeWidget,
    };

    setPlacedWidgets((prev) => [...prev, newWidget]);
    setHoveredCells([]);
    setActiveWidget(null); // Сброс активного виджета
};


  const isCellOccupied = (cellId: string) =>
    placedWidgets.some((widget) => widget.cells.includes(cellId));

  return (
    <div className="flex flex-col items-center justify-end h-full w-full">
      {/* Сетка */}
      <div
        className="relative grid grid-rows-2 grid-cols-3 gap-4 w-3/4 h-4/5"
        onClick={handlePlaceWidget}
      >
        {grid.map((cell) =>
          isCellOccupied(cell.id) ? null : (
            <div
              key={cell.id}
              onMouseMove={(e) => handleMouseMove(e, cell)}
              onMouseLeave={clearHover}
              className={`flex items-center justify-center font-bold h-full w-full border-2 border-gray-300 rounded-lg transition-all duration-300 
                ${activeWidget ? "cursor-pointer" 
                    : "cursor-not-allowed"}
                ${
                hoveredCells.includes(cell.id)
                  ? "bg-green-100 border-green-300 scale-105"
                  : "bg-white"
              }`}
            >
                <Plus className={` transition-all duration-300 ${
                hoveredCells.includes(cell.id)
                  && "text-green-500 scale-105"
                  
              }`}/>
            </div>
          )
        )}

        {/* Рендер виджетов */}
        {placedWidgets.map((widget) => {
          const rows = widget.cells.map((id) => Number(id.split("-")[0]));
          const cols = widget.cells.map((id) => Number(id.split("-")[1]));

          const minRow = Math.min(...rows);
          const maxRow = Math.max(...rows);
          const minCol = Math.min(...cols);
          const maxCol = Math.max(...cols);

          const spanRows = maxRow - minRow + 1;
          const spanCols = maxCol - minCol + 1;

          return (
            <div
                key={widget.id}
                className="relative border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-xl font-bold transition-all duration-300 rounded-lg group overflow-hidden"
                style={{
                    gridRow: `${minRow + 1} / span ${spanRows}`,
                    gridColumn: `${minCol + 1} / span ${spanCols}`,
                }}
                >
                    <div className="absolute top-1 right-1 w-5 h-5 z-10">
                        <div
                        className="w-full h-full flex items-center justify-center cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPlacedWidgets((prev) => prev.filter((w) => w.id !== widget.id));
                        }}
                        >
                        <div className=" opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-2xl w-5 h-5 flex items-start justify-end ">
                            <X className="w-5 h-5 text-gray-400" />
                        </div>
                        </div>
                    </div>
                {/* Виджет */}
                <WidgetContainer>
                    <widget.widget.component />
                </WidgetContainer>
            </div>
          );
        })}
      </div>

      {/* Меню выбора виджетов */}
      <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.7 }} 
                className="flex flex-row gap-3 items-center justify-start w-3/4 h-24 border-1 border-gray-300 rounded-lg bg-white overflow-x-auto px-4 mt-4">
        {widgetList.map((widget) => (
          <div
            key={widget.id}
            onClick={() => setActiveWidget(widget)}
            className={`min-w-[100px] h-4/5 ${
              activeWidget?.id === widget.id
                && "scale-110"
                
            } transition-all rounded-lg p-2 text-center flex items-center justify-center cursor-pointer`}
          >
            <widget.preview/>
            {/* {widget.name} */}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
