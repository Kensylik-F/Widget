import { AnimatePresence, motion } from "framer-motion";
import Dashboard from "./Dashboard";



export default function MainLayout() {

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center text-lg font-medium w-screen "
                >
                    WidGet
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.9 }}
                    className="flex flex-col items-center justify-center h-4/5 w-screen p-4"
                >
                    <Dashboard/>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
