import React from "react";
import { InlineMath } from "react-katex";
import { formulaToLaTeX, processFormulaWithValues } from "@/lib/utils";
import "katex/dist/katex.min.css";

function ResultDisplay({
  formula = "v = v₀ + at",
  values = {},
  variables = [],
  result = null,
  resultUnit = "",
  formulaId = "",
  isCalculating = false,
  formulaConfig = null,
}) {
  const displayFormula = formulaConfig
    ? processFormulaWithValues(
        formula,
        values,
        variables,
        formulaConfig.required
      )
    : processFormulaWithValues(formula, values, variables);
  const latexFormula = formulaToLaTeX(displayFormula);

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
        Result
      </h3>
      <div className="w-full bg-muted dark:bg-muted/50 border border-border rounded-lg p-4 h-[120px] flex flex-col items-center justify-center gap-3 shadow-sm">
        <div className="text-xl md:text-2xl text-foreground">
          <InlineMath math={latexFormula} />
        </div>
        {isCalculating ? (
          <div className="text-lg md:text-xl text-muted-foreground">
            Calculating...
          </div>
        ) : (
          result !== null &&
          result !== undefined && (
            <div className="text-2xl md:text-3xl font-bold text-primary">
              <InlineMath
                math={`= ${result}${
                  resultUnit ? `\\text{ ${resultUnit}}` : ""
                }`}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ResultDisplay;
