import { useState, useEffect, useRef } from "react";

export const TimerItem = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          alert("Timer finished!");
        } else {
          decrementTime();
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [isRunning, hours, minutes, seconds]);

  const decrementTime = () => {
    if (seconds > 0) setSeconds((prev) => prev - 1);
    else if (minutes > 0) {
      setMinutes((prev) => prev - 1);
      setSeconds(59);
    } else if (hours > 0) {
      setHours((prev) => prev - 1);
      setMinutes(59);
      setSeconds(59);
    }
  };

  const handleScroll = (e: React.WheelEvent, unit: 'hours' | 'minutes' | 'seconds') => {
    const delta = e.deltaY > 0 ? -1 : 1;
    adjustTime(unit, delta);
  };

  const adjustTime = (unit: 'hours' | 'minutes' | 'seconds', delta: number) => {
    if (unit === 'hours') setHours((prev) => Math.max(0, prev + delta));
    if (unit === 'minutes') setMinutes((prev) => (prev + delta + 60) % 60);
    if (unit === 'seconds') setSeconds((prev) => (prev + delta + 60) % 60);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, unit: 'hours' | 'minutes' | 'seconds') => {
    const val = parseInt(e.target.value) || 0;
    if (unit === 'hours') setHours(Math.max(0, val));
    if (unit === 'minutes') setMinutes((val + 60) % 60);
    if (unit === 'seconds') setSeconds((val + 60) % 60);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current!);
    setIsRunning(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 text-center items-center justify-center">
        {['hours', 'minutes', 'seconds'].map((unit) => (
          <div
            key={unit}
            onWheel={(e) => handleScroll(e, unit as any)}
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <input
              type="number"
              value={unit === 'hours' ? hours : unit === 'minutes' ? minutes : seconds}
              onChange={(e) => handleInput(e, unit as any)}
              className="w-10 text-center text-xl outline-none"
            />
            <span className="text-[8px] uppercase">{unit}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        {!isRunning ? (
          <button onClick={() => setIsRunning(true)} className=" text-black px-4 py-2 rounded-xl">Start</button>
        ) : (
          <button onClick={() => setIsRunning(false)} className=" text-black px-4 py-2 rounded-xl">Pause</button>
        )}
        <button onClick={resetTimer} className=" text-black px-4 py-2 rounded-xl">Reset</button>
      </div>
    </div>
  );
};
