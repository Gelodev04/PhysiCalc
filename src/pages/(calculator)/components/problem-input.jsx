import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parsePhysicsProblem } from "@/lib/ai-parser";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

function ProblemInput({ onParse, isParsing, error, currentFormulaId }) {
  const [problemText, setProblemText] = useState("");

  const handleParse = async () => {
    if (!problemText.trim()) {
      return;
    }

    try {
      const result = await parsePhysicsProblem(problemText, currentFormulaId);
      if (result.error) {
        onParse(null, result.error);
      } else {
        onParse(result.formulaId, result.values);
      }
    } catch (error) {
      onParse(
        null,
        error.message || "Failed to parse problem. Please try again."
      );
    }
  };

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Enter Physics Problem
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <textarea
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="Example: A car starts from rest and accelerates at 5 m/s² for 10 seconds. Find its final velocity."
            className="w-full min-h-[120px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isParsing}
          />
          <p className="text-xs text-muted-foreground">
            Describe your physics problem and we'll automatically identify the
            formula and extract values.
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0" />
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> The parser may sometimes encounter errors
              or not read values correctly. If the automatic parsing doesn't
              work as expected, you may need to enter the values manually using
              the input fields above.
            </p>
          </div>
        </div>

        <Button
          onClick={handleParse}
          disabled={!problemText.trim() || isParsing}
          className="w-full"
        >
          {isParsing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Parsing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Parse Problem
            </>
          )}
        </Button>

        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ProblemInput;
