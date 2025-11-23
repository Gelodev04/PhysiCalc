import React, { useState } from "react";
import { getCategories, getFormulasByCategory } from "@/lib/formulas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { cn } from "@/lib/utils";

function FormulaContainer({ selectedFormulaId, onFormulaSelect }) {
  const [expandedCategories, setExpandedCategories] = useState({
    Kinematics: true,
  });
  const categories = getCategories();

  const handleChange = (category) => (event, isExpanded) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: isExpanded,
    }));
  };

  return (
    <Card className="w-full sticky top-6">
      <CardHeader>
        <CardTitle className="text-2xl">Formulas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.map((category) => {
            const formulas = getFormulasByCategory(category);
            const isExpanded = expandedCategories[category] || false;

            return (
              <Accordion
                key={category}
                expanded={isExpanded}
                onChange={handleChange(category)}
                sx={{
                  boxShadow: "none",
                  "&:before": {
                    display: "none",
                  },
                  "&.Mui-expanded": {
                    margin: "0 0 8px 0",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    padding: "8px 0",
                    minHeight: "auto",
                    "&.Mui-expanded": {
                      minHeight: "auto",
                    },
                    "& .MuiAccordionSummary-content": {
                      margin: "0",
                      "&.Mui-expanded": {
                        margin: "0",
                      },
                    },
                  }}
                >
                  <span className="font-semibold text-lg">{category}</span>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "8px 0 8px 16px" }}>
                  <div className="space-y-1">
                    {formulas.map((formula) => (
                      <Button
                        key={formula.id}
                        variant={
                          selectedFormulaId === formula.id ? "default" : "ghost"
                        }
                        onClick={() => onFormulaSelect(formula.id)}
                        className={cn(
                          "w-full justify-start text-sm",
                          selectedFormulaId === formula.id
                            ? "font-semibold"
                            : "text-muted-foreground"
                        )}
                      >
                        - {formula.name}
                      </Button>
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default FormulaContainer;
