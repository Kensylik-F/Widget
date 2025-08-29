import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Unit = "hours" | "minutes" | "seconds";

interface TimerProps {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
  onFinish?: () => void;
  maxHours?: number;
}

export const TimerItem: React.FC<TimerProps> = ({
  initialHours = 0,
  initialMinutes = 0,
  initialSeconds = 0,
  onFinish,
  maxHours = 99,
}) => {
  // single source of truth
  const initialTotal =
    Math.max(0, Math.floor(initialHours)) * 3600 +
    Math.max(0, Math.floor(initialMinutes)) * 60 +
    Math.max(0, Math.floor(initialSeconds));

  const [totalSeconds, setTotalSeconds] = useState<number>(initialTotal);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          // stop when done
          if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsRunning(false);
          onFinish?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, onFinish]);

  // derived values
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // adjust by unit in seconds
  const adjustBy = useCallback((unit: Unit, delta: number) => {
    const amount = unit === "hours" ? delta * 3600 : unit === "minutes" ? delta * 60 : delta;
    setTotalSeconds((prev) => {
      const next = prev + amount;
      if (next < 0) return 0;
      // optional clamp max hours
      const maxTotal = maxHours * 3600;
      return Math.min(next, maxTotal);
    });
  }, [maxHours]);

  const handleWheel = useCallback((e: React.WheelEvent, unit: Unit) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    adjustBy(unit, delta);
  }, [adjustBy]);

  const handleInput = useCallback((value: string, unit: Unit) => {
    // безопасный парсинг
    const v = Number.isNaN(Number(value)) ? 0 : Math.max(0, Math.floor(Number(value)));
    const clamped = unit === "hours" ? Math.min(v, maxHours) : Math.min(v, 59);

    setTotalSeconds((prev) => {
      const h = Math.floor(prev / 3600);
      const m = Math.floor((prev % 3600) / 60);
      const s = prev % 60;

      if (unit === "hours") return clamped * 3600 + m * 60 + s;
      if (unit === "minutes") return h * 3600 + clamped * 60 + s;
      return h * 3600 + m * 60 + clamped; // seconds
    });
  }, [maxHours]);

  const resetTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setTotalSeconds(0);
  }, []);

  const toggle = useCallback(() => {
    // если нет времени — не запускаем
    if (!isRunning && totalSeconds === 0) return;
    setIsRunning((p) => !p);
  }, [isRunning, totalSeconds]);

  // user-friendly array for rendering
  const units: Unit[] = useMemo(() => ["hours", "minutes", "seconds"], []);

  return (
    <div className="flex flex-col items-center gap-4" aria-live="polite">
      <div className="flex gap-6 text-center items-center justify-center">
        {units.map((unit) => {
          const value = unit === "hours" ? hours : unit === "minutes" ? minutes : seconds;
          return (
            <div
              key={unit}
              onWheel={(e) => handleWheel(e, unit)}
              className="flex flex-col items-center justify-center cursor-pointer"
              role="spinbutton"
              aria-label={unit}
              aria-valuenow={value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") adjustBy(unit, 1);
                if (e.key === "ArrowDown") adjustBy(unit, -1);
              }}
            >
              <input
                inputMode="numeric"
                aria-label={`${unit} input`}
                type="number"
                min={0}
                max={unit === "hours" ? maxHours : 59}
                value={value}
                onChange={(e) => handleInput(e.target.value, unit)}
                className="w-12 text-center text-xl outline-none"
              />
              <span className="text-[8px] uppercase">{unit}</span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggle}
          className="text-black px-4 py-2 rounded-xl"
          aria-pressed={isRunning}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={resetTimer} className="text-black px-4 py-2 rounded-xl">Reset</button>
      </div>
    </div>
  );
};
