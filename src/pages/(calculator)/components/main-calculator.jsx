import React from "react";
import FormulaDisplay from "./formula-display";
import ResultDisplay from "./result-display";
import VariableInput from "./variable-input";
import { useCalculator } from "@/hooks/useCalculator";
import { getResultUnit } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function MainCalculator({
  selectedFormulaId = "velocity",
  formulaConfig,
  values,
  result,
  isCalculating,
  error,
  handleValueChange,
  clearInputs,
}) {
  return (
    <Card className="w-full flex flex-col gap-6 p-6">
      {/* formula */}
      <FormulaDisplay
        formula={formulaConfig.formula}
        formulaName={formulaConfig.name}
      />

      {/* result */}
      <ResultDisplay
        formula={formulaConfig.formula}
        values={values}
        variables={formulaConfig.variables}
        result={result}
        resultUnit={getResultUnit(formulaConfig)}
        formulaId={formulaConfig.id}
        isCalculating={isCalculating}
        formulaConfig={formulaConfig}
      />

      {/* inputs */}
      <div className="w-full">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          Input Values
        </h3>
        <div
          className={`grid gap-4 ${
            formulaConfig.variables.length === 1
              ? "grid-cols-1"
              : formulaConfig.variables.length === 2
              ? "grid-cols-2"
              : "grid-cols-3"
          }`}
        >
          {formulaConfig.variables.map((variable) => (
            <VariableInput
              key={variable.key}
              label={variable.label}
              name={variable.name}
              unit={variable.unit}
              value={values[variable.key]}
              onChange={(value) => handleValueChange(variable.key, value)}
              placeholder={variable.placeholder}
            />
          ))}
        </div>
      </div>

      {/* clear */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={clearInputs}
          className="w-full sm:w-auto"
        >
          Clear Inputs
        </Button>
      </div>

      {/* error */}
      {error && (
        <div className="w-full bg-destructive/10 border border-destructive rounded-lg p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </Card>
  );
}

export default MainCalculator;
