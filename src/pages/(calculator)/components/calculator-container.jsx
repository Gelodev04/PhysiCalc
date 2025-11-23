import React, { useState, useEffect, useRef } from "react";
import MainCalculator from "./main-calculator";
import FormulaContainer from "./formula-container";
import StepByStepSolution from "./step-by-step-solution";
import FormulaDetails from "./formula-details";
import ProblemInput from "./problem-input";
import { Card } from "@/components/ui/card";
import { useCalculator } from "@/hooks/useCalculator";
import { getResultUnit } from "@/lib/utils";

function CalculatorContainer() {
  const [selectedFormulaId, setSelectedFormulaId] = useState("velocity");
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState(null);
  const pendingValuesRef = useRef(null);
  const {
    formulaConfig,
    values,
    result,
    isCalculating,
    error,
    handleValueChange,
    clearInputs,
    setValuesDirectly,
  } = useCalculator(selectedFormulaId);

  useEffect(() => {
    if (pendingValuesRef.current && formulaConfig.id === selectedFormulaId) {
      const timer = setTimeout(() => {
        const valuesToSet = { ...pendingValuesRef.current };
        setValuesDirectly(valuesToSet);
        pendingValuesRef.current = null;
        setIsParsing(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [formulaConfig.id, selectedFormulaId, setValuesDirectly]);

  const handleProblemParse = async (formulaId, extractedValues) => {
    setIsParsing(true);
    setParseError(null);

    clearInputs();

    try {
      if (formulaId) {
        if (extractedValues && Object.keys(extractedValues).length > 0) {
          pendingValuesRef.current = extractedValues;
        }

        setSelectedFormulaId(formulaId);
      } else {
        setParseError(
          "Could not identify a formula for this problem. Please try rephrasing."
        );
        setIsParsing(false);
      }
    } catch (err) {
      setParseError(
        err.message || "Failed to parse problem. Please try again."
      );
      setIsParsing(false);
      pendingValuesRef.current = null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* main calculator */}
          <div className="flex-1 w-full lg:max-w-4xl lg:mx-auto space-y-5 order-2 lg:order-1">
            <MainCalculator
              selectedFormulaId={selectedFormulaId}
              formulaConfig={formulaConfig}
              values={values}
              result={result}
              isCalculating={isCalculating}
              error={error}
              handleValueChange={handleValueChange}
              clearInputs={clearInputs}
            />
            <ProblemInput
              onParse={handleProblemParse}
              isParsing={isParsing}
              error={parseError}
              currentFormulaId={selectedFormulaId}
            />
            <StepByStepSolution
              formula={formulaConfig.formula}
              values={values}
              variables={formulaConfig.variables}
              result={result}
              resultUnit={getResultUnit(formulaConfig)}
            />

            {result !== null &&
              result !== undefined &&
              Object.values(values || {}).some(
                (v) => v !== "" && v !== null && v !== undefined
              ) && <div className="border-t border-border my-6"></div>}

            <FormulaDetails
              formula={formulaConfig.formula}
              formulaConfig={formulaConfig}
            />
          </div>

          <div className="w-full lg:w-80 lg:shrink-0 order-1 lg:order-2">
            <FormulaContainer
              selectedFormulaId={selectedFormulaId}
              onFormulaSelect={setSelectedFormulaId}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CalculatorContainer;
