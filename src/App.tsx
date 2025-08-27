import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { MainLayout, WelcomeLayout } from "./pages"
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

function App() {
  const [widgetVisible, setWidgetVisible] = useState(true);
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <AnimatePresence>
        <BrowserRouter>
          <Routes>
            {widgetVisible && (
              <Route path="/" element={<WelcomeLayout setWidgetVisible={setWidgetVisible}/>}/>
            )}

            <Route path="/dashboard" element={<MainLayout />}/>

            {!widgetVisible && (
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            )}
          </Routes>
        </BrowserRouter>
        </AnimatePresence>
    </div>
   
  )
}

export default App
