import React from "react";
import MainCalculator from "./main-calculator";
import { Card } from "@/components/ui/card";
import FormulaContainer from "./formula-container";

function CalculatorContainer() {
  return (
    <Card className="max-w-6xl mx-auto p-6 flex flex-row justify-between min-h-screen">
      <MainCalculator />
      <FormulaContainer/>
    </Card>
  );
}

export default CalculatorContainer;
