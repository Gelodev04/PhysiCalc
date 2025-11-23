import React from "react";
import { InlineMath } from "react-katex";
import { formulaToLaTeX, processFormulaWithValues } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import "katex/dist/katex.min.css";

function StepByStepSolution({
  formula,
  values,
  variables,
  result,
  resultUnit,
}) {
  const hasValues = Object.values(values || {}).some(
    (v) => v !== "" && v !== null && v !== undefined
  );

  if (!hasValues || result === null || result === undefined || !formula) {
    return null;
  }

  const steps = [];

  steps.push({
    step: 1,
    title: "Given Formula",
    content: formula,
  });

  const substitutionFormula = processFormulaWithValues(
    formula,
    values,
    variables
  );

  steps.push({
    step: 2,
    title: "Substitute Values",
    content: substitutionFormula,
  });

  if (result !== null && result !== undefined) {
    steps.push({
      step: 3,
      title: "Result",
      content: `= ${result}${resultUnit ? ` ${resultUnit}` : ""}`,
    });
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Step-by-Step Solution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                {step.step}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  {step.title}
                </h4>
                <div className="text-lg">
                  <InlineMath math={formulaToLaTeX(step.content)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default StepByStepSolution;
