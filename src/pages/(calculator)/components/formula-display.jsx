import React from "react";
import { BlockMath } from "react-katex";
import { formulaToLaTeX } from "@/lib/utils";
import "katex/dist/katex.min.css";

function FormulaDisplay({ formula = "v = v₀ + at", formulaName }) {
  const latexFormula = formulaToLaTeX(formula);

  const getFormulaLabel = () => {
    if (!formulaName) {
      return "Formula";
    }
    let label = formulaName.toLowerCase();
    if (label.startsWith("find ")) {
      label = "finding " + label.substring(5);
    } else if (label.startsWith("calculate ")) {
      label = "calculating " + label.substring(10);
    }
    return `Formula for ${label}`;
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
        {getFormulaLabel()}
      </h3>
      <div className="w-full bg-white dark:bg-card border-2 border-border rounded-lg p-8 min-h-[350px] flex items-center justify-center shadow-sm">
        <div className="text-4xl md:text-5xl text-foreground">
          <BlockMath math={latexFormula} />
        </div>
      </div>
    </div>
  );
}

export default FormulaDisplay;
