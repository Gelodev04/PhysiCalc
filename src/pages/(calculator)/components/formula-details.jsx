import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { InlineMath } from "react-katex";
import { formulaToLaTeX } from "@/lib/utils";
import { getFormulaExplanation } from "@/lib/formula-explanations";
import "katex/dist/katex.min.css";

function FormulaDetails({ formula, formulaConfig }) {
  if (!formula || !formulaConfig) {
    return null;
  }

  const explanation = getFormulaExplanation(
    formulaConfig.id,
    formulaConfig.category
  );

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">About This Formula</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2 uppercase tracking-wide">
              Formula
            </h4>
            <div className="text-lg">
              <InlineMath math={formulaToLaTeX(formula)} />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2 uppercase tracking-wide">
              Description
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {explanation.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2 uppercase tracking-wide">
              When to Use
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {explanation.whenToUse}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2 uppercase tracking-wide">
              Example
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {explanation.example}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FormulaDetails;
