import { useState, useRef, useEffect } from "react";

export const StopWatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
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
        <button onClick={handleReset} className=" text-black px-4 py-2 rounded-xl">Reset</button>
      </div>

    </div>
  );
};
