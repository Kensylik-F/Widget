import { Clock, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StopWatch } from "./item/StopWatchItem";
import { TimerItem } from "./item/TimerItem";

export const TimerWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mode, setMode] = useState<'clock' | 'stopwatch' | 'timer' | 'pomodoro'>('clock');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  const shortFormatDate = (date: Date) => {
   const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long'};
    return date.toLocaleDateString('en-US', options);
  };

  const renderModeContent = () => {
    switch (mode) {
      case 'stopwatch':
        return <div className="text-sm font-bold">
                <StopWatch />
              </div>;
      case 'timer':
        return <div className="text-sm font-bold">
                <TimerItem />
              </div>;
      case 'pomodoro':
        return <div className="text-sm font-bold">Pomodoro Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
      {/* Название режима слева вверху */}
      {mode !== 'clock' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute top-5 left-5 text-[12px] font-semibold"
        >
          {mode.toUpperCase()}
        </motion.div>
      )}

      {/* Часы и Дата */}
      <motion.div
        animate={mode === 'clock' 
          ? { top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' } 
          : { top: '20px', right: '20px', left: 'auto', translateX: '0%', translateY: '0%' }
        }
        transition={{ type: 'spring', stiffness: 120 }}
        className={`absolute ${mode === 'clock' ? 'flex flex-col text-center justify-center items-center' : 'flex flex-row justify-end items-center gap-2'}`}
        onClick={() => setMode('clock')}
      >
        <div className={`${mode !== 'clock' ? 'text-[12px]' : 'text-5xl'} font-bold `}>
          {formatTime(currentTime)}
        </div>
        <div className={`${mode !== 'clock' ? 'text-[10px]' : 'text-sm'} font-medium whitespace-nowrap`}>
          {mode !== 'clock' ? shortFormatDate(currentTime) : formatDate(currentTime)}
        </div>

      </motion.div>


      {/* Центральный Контент */}
      <AnimatePresence mode="wait">
        {mode !== 'clock' && (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            // className="mt-32"
          >
            {renderModeContent()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Переключалка режимов */}
      <div className="absolute bottom-5 flex items-center space-x-4 text-gray-600">
        <Clock
          className={`w-6 h-6 cursor-pointer ${mode === 'clock' ? 'text-black' : ''}`}
          onClick={() => setMode('stopwatch')}
        />
        <div
          className={`text-sm text-center bg-gray-200 pt-1 pb-1 pr-4 pl-4 rounded-xl cursor-pointer ${mode === 'pomodoro' ? 'bg-black text-white' : ''}`}
          onClick={() => setMode('pomodoro')}
        >
          Focus
        </div>
        <Timer
          className={`w-6 h-6 cursor-pointer ${mode === 'timer' ? 'text-black' : ''}`}
          onClick={() => setMode('timer')}
        />
      </div>
    </div>
  );
};
