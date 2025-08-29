import { useState, useRef, useEffect } from "react";

export const StopWatch = () => {
  const [time, setTime] = useState(0); // time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  const handleLap = () => {
    setLaps([time, ...laps]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-4xl font-mono">{formatTime(time)}</div>

      <div className="flex gap-4">
        {!isRunning ? (
          <button onClick={() => setIsRunning(true)} className=" text-black px-4 py-2 rounded-xl">Start</button>
        ) : (
          <button onClick={() => setIsRunning(false)} className=" text-black px-4 py-2 rounded-xl">Pause</button>
        )}
        <button onClick={handleLap} className=" text-black px-4 py-2 rounded-xl" disabled={!isRunning}>Lap</button>
        <button onClick={handleReset} className=" text-black px-4 py-2 rounded-xl">Reset</button>
      </div>

      {laps.length > 0 && (
        <div className="w-full max-w-xs mt-4">
          <div className="text-xs font-bold uppercase mb-2">Laps</div>
          <div className="overflow-y-auto max-h-40">
            {laps.map((lap, index) => (
              <div key={index} className="flex justify-between text-sm py-1 border-b">
                <span>Lap {laps.length - index}</span>
                <span>{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
