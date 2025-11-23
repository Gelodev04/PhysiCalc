import { useState, useEffect } from "react";
import CalculatorContainer from "./components/calculator-container";
import Header from "./components/header";
import { Progress } from "@/components/ui/progress";

export default function Calculator() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + 10;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-8 space-y-8">
          <div className="flex justify-center">
            <img
              src="/physiCalcLogo.png"
              alt="PhysiCalc Logo"
              className="h-32 w-auto object-contain"
            />
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="w-full h-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <CalculatorContainer />
    </div>
  );
}
