import React, { useState, useEffect, useRef } from "react";
import MainCalculator from "./main-calculator";
import FormulaContainer from "./formula-container";
import StepByStepSolution from "./step-by-step-solution";
import FormulaDetails from "./formula-details";
import ProblemInput from "./problem-input";
import { Card } from "@/components/ui/card";
import { useCalculator } from "@/hooks/useCalculator";
import { getResultUnit } from "@/lib/utils";
import { toast } from "sonner";

function CalculatorContainer() {
  const [selectedFormulaId, setSelectedFormulaId] = useState("velocity");
  const [isParsing, setIsParsing] = useState(false);
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
        const extractedCount = Object.keys(valuesToSet).filter(
          (key) =>
            valuesToSet[key] !== "" &&
            valuesToSet[key] !== null &&
            valuesToSet[key] !== undefined
        ).length;

        setValuesDirectly(valuesToSet);
        pendingValuesRef.current = null;
        setIsParsing(false);

        if (extractedCount > 0) {
          toast.success(
            `Successfully extracted ${extractedCount} value${
              extractedCount > 1 ? "s" : ""
            } from the problem!`
          );
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [formulaConfig.id, selectedFormulaId, setValuesDirectly]);

  const handleProblemParse = async (formulaId, extractedValues, error) => {
    setIsParsing(true);

    clearInputs();

    try {
      if (error) {
        toast.error(error);
        setIsParsing(false);
        return;
      }

      if (formulaId) {
        const hasValidValues =
          extractedValues &&
          Object.keys(extractedValues).length > 0 &&
          Object.values(extractedValues).some(
            (value) => value !== "" && value !== null && value !== undefined
          );

        if (hasValidValues) {
          pendingValuesRef.current = extractedValues;
        } else {
          toast.error(
            "No values could be extracted from the problem. Please enter the values manually or try rephrasing the problem."
          );
          setIsParsing(false);
          return;
        }

        setSelectedFormulaId(formulaId);
      } else {
        toast.error(
          "Could not identify a formula for this problem. Please try rephrasing."
        );
        setIsParsing(false);
      }
    } catch (err) {
      toast.error(err.message || "Failed to parse problem. Please try again.");
      setIsParsing(false);
      pendingValuesRef.current = null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 bg-white/50">
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
