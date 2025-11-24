import React, { useState, useMemo } from "react";
import { getCategories, getFormulasByCategory, FORMULAS } from "@/lib/formulas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

function FormulaContainer({ selectedFormulaId, onFormulaSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({
    Kinematics: true,
  });
  const categories = getCategories();

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return { categories, filteredFormulas: {} };
    }

    const query = searchQuery.toLowerCase().trim();
    const filteredFormulas = {};
    const matchingCategories = [];

    categories.forEach((category) => {
      const formulas = getFormulasByCategory(category);
      const matchingFormulas = formulas.filter(
        (formula) =>
          formula.name.toLowerCase().includes(query) ||
          formula.category.toLowerCase().includes(query) ||
          formula.formula.toLowerCase().includes(query) ||
          formula.id.toLowerCase().includes(query)
      );

      if (matchingFormulas.length > 0) {
        filteredFormulas[category] = matchingFormulas;
        matchingCategories.push(category);
      }
    });

    return {
      categories: matchingCategories,
      filteredFormulas,
    };
  }, [searchQuery, categories]);

  const handleChange = (category) => (event, isExpanded) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: isExpanded,
    }));
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const getExpandedState = (category) => {
    if (searchQuery.trim()) {
      return true;
    }
    return expandedCategories[category] || false;
  };

  const totalFormulas = useMemo(() => {
    return Object.keys(FORMULAS).length;
  }, []);

  const getFormulaCount = (category) => {
    if (searchQuery.trim()) {
      return filteredData.filteredFormulas[category]?.length || 0;
    }
    return getFormulasByCategory(category).length;
  };

  return (
    <Card className="w-full sticky top-6 bg-card/95 border-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Formulas</CardTitle>
          <Badge variant="secondary" className="ml-2">
            {totalFormulas} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search formulas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filteredData.categories.length === 0 && searchQuery.trim() ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No formulas found matching "{searchQuery}"
            </div>
          ) : (
            (searchQuery.trim() ? filteredData.categories : categories).map(
              (category) => {
                const formulas = searchQuery.trim()
                  ? filteredData.filteredFormulas[category] || []
                  : getFormulasByCategory(category);
                const isExpanded = getExpandedState(category);

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
                      <div className="flex items-center justify-between w-full mr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            {category}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {getFormulaCount(category)}
                          </Badge>
                        </div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: "8px 0 8px 16px" }}>
                      <div className="space-y-1">
                        {formulas.map((formula) => (
                          <Button
                            key={formula.id}
                            variant={
                              selectedFormulaId === formula.id
                                ? "default"
                                : "ghost"
                            }
                            onClick={() => onFormulaSelect(formula.id)}
                            className={cn(
                              "w-full justify-start text-sm transition-colors",
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
              }
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default FormulaContainer;
