import React from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

function VariableInput({
  label,
  name,
  unit,
  value,
  onChange,
  placeholder = "0",
}) {
  return (
    <div className="flex flex-col gap-2">
      <input
        type="number"
        step="any"
        value={value || ""}
        onChange={(e) => {
          const inputValue = e.target.value;
          if (inputValue.length <= 15) {
            onChange(inputValue);
          }
        }}
        onInput={(e) => {
          const inputValue = e.target.value;
          if (inputValue.length > 15) {
            e.target.value = inputValue.slice(0, 15);
            onChange(inputValue.slice(0, 15));
          }
        }}
        placeholder={placeholder}
        className="w-full h-16 px-4 text-center text-2xl font-mono border-2 border-border rounded-lg bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
      />
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
      </div>
    </div>
  );
}

export default VariableInput;
