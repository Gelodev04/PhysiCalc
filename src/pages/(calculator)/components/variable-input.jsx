import React, { useState, useEffect } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateNumberInput } from "@/lib/validation";

function VariableInput({
  label,
  name,
  unit,
  value,
  onChange,
  placeholder = "0",
}) {
  const [error, setError] = useState("");

  useEffect(() => {
    if (value !== undefined && value !== null) {
      const validation = validateNumberInput(value);
      setError(validation.error);
    }
  }, [value]);

  const handleChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 15) {
      onChange(inputValue);
      const validation = validateNumberInput(inputValue);
      setError(validation.error);
    }
  };

  const handleBlur = () => {
    if (value && value.trim() !== "") {
      const validation = validateNumberInput(value);
      setError(validation.error);
    }
  };

  const hasError = error !== "";

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={value || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "w-full h-16 px-4 text-center text-2xl font-mono border-2 rounded-lg bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 transition-all",
            hasError
              ? "border-destructive focus:ring-destructive/50 focus:border-destructive"
              : "border-border focus:ring-primary/50 focus:border-primary/50 hover:border-primary/30"
          )}
        />
        {hasError && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
        )}
      </div>
      <div className="text-center">
        <label className="text-sm font-semibold text-foreground">
          <InlineMath math={label} />
        </label>
        {unit && (
          <span className="text-xs text-muted-foreground ml-1">
            (<InlineMath math={unit} />)
          </span>
        )}
        {name && (
          <div className="text-xs text-muted-foreground mt-1">{name}</div>
        )}
        {/* {hasError && (
          <div className="text-xs text-destructive mt-1 flex items-center justify-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </div>
        )} */}
      </div>
    </div>
  );
}

export default VariableInput;
