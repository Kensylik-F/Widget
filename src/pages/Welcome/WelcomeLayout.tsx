
import { AnimatePresence,motion } from "framer-motion";



interface WidgetAppProps {
    setWidgetVisible: (visible: boolean) => void;
}  



export default function WelcomeLayout({ setWidgetVisible }: WidgetAppProps) {
  return (
   <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, scale: 0.8,  }}
            animate={{ opacity: 1,scale:1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-scree p-4">
            <p className="text-2xl font-bold mb-4">
                Добро пожаловать в виджет!
            </p>
            <p className="text-base font-medium text-gray-600">
                Это концептуальный учебный проект который будет дорабатываться в будущем.
            </p>
            <p className="text-sm font-medium text-gray-600 w-xl  mb-4 text-center">
                Вы сможете настроить свое рабочее пространство виджетами которые облегчат вашу работу, фокус и помогут вам быть более продуктивными.
            </p>
            <button onClick={() => setWidgetVisible(false)} >
                Попробовать
            </button>
        </motion.div>
   </AnimatePresence>
  );
}