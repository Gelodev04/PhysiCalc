import React, { useState } from "react";
import { InlineMath } from "react-katex";
import { formulaToLaTeX, processFormulaWithValues } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
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
  const [copied, setCopied] = useState(false);
  const displayFormula = formulaConfig
    ? processFormulaWithValues(
        formula,
        values,
        variables,
        formulaConfig.required
      )
    : processFormulaWithValues(formula, values, variables);
  const latexFormula = formulaToLaTeX(displayFormula);

  const handleCopy = async () => {
    if (result === null || result === undefined) return;

    const resultText = `${result}${resultUnit ? ` ${resultUnit}` : ""}`;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Result
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-xs gap-1.5"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
            </>
          )}
        </Button>
      </div>
      <div className="w-full bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 border-2 border-primary/30 rounded-lg p-4 h-[120px] flex flex-col items-center justify-center gap-3 shadow-sm">
        <div className="text-xl md:text-2xl text-foreground/90">
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
