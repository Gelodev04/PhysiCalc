import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Calculator from "./pages/(calculator)/Calculator";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculate" element={<Calculator />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
