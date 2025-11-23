import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getResultUnit(formulaConfig) {
  if (formulaConfig.category === "Kinematics") {
    if (formulaConfig.id === "displacement") return "m";
    if (formulaConfig.id === "velocity") return "m/s";
    if (formulaConfig.id === "acceleration") return "m/s²";
    if (formulaConfig.id === "time") return "s";
  }
  if (formulaConfig.category === "Electricity") {
    if (formulaConfig.id === "current") return "A";
    if (formulaConfig.id === "voltage") return "V";
    if (formulaConfig.id === "resistance") return "Ω";
    if (formulaConfig.id === "power") return "W";
  }
  if (formulaConfig.category === "Forces") return "N";
  if (formulaConfig.category === "Work & Energy") {
    if (
      formulaConfig.id === "work" ||
      formulaConfig.id === "kineticEnergy" ||
      formulaConfig.id === "potentialEnergy"
    )
      return "J";
    if (formulaConfig.id === "power") return "W";
  }
  if (formulaConfig.category === "Projectile Motion") {
    if (
      formulaConfig.id === "projectileHeight" ||
      formulaConfig.id === "projectileRange"
    )
      return "m";
    if (formulaConfig.id === "projectileTime") return "s";
  }
  return "";
}

export function formulaToLaTeX(formula) {
  if (!formula) return "";

  let latex = formula;

  const subscriptMap = {
    "₀": "_0",
    "₁": "_1",
    "₂": "_2",
    "₃": "_3",
    "₄": "_4",
    "₅": "_5",
    "₆": "_6",
    "₇": "_7",
    "₈": "_8",
    "₉": "_9",
  };

  const superscriptMap = {
    "²": "^2",
    "³": "^3",
    "¹": "^1",
  };

  Object.entries(subscriptMap).forEach(([unicode, latexSub]) => {
    latex = latex.replace(new RegExp(unicode, "g"), `{${latexSub}}`);
  });

  Object.entries(superscriptMap).forEach(([unicode, latexSup]) => {
    latex = latex.replace(new RegExp(unicode, "g"), `{${latexSup}}`);
  });

  latex = latex.replace(/½/g, "\\frac{1}{2}");
  latex = latex.replace(/¼/g, "\\frac{1}{4}");
  latex = latex.replace(/¾/g, "\\frac{3}{4}");

  latex = latex.replace(/×/g, "\\cdot");

  latex = latex.replace(/\bsin²\s*\(/g, "\\sin^2(");
  latex = latex.replace(/\bcos²\s*\(/g, "\\cos^2(");
  latex = latex.replace(/\btan²\s*\(/g, "\\tan^2(");
  latex = latex.replace(/\bsin\s*\(/g, "\\sin(");
  latex = latex.replace(/\bcos\s*\(/g, "\\cos(");
  latex = latex.replace(/\btan\s*\(/g, "\\tan(");

  return latex;
}

export function processFormulaWithValues(
  formula,
  values,
  variables,
  requiredKeys = []
) {
  let displayFormula = formula;

  // If required keys are specified, only process if all required values are present
  if (requiredKeys.length > 0) {
    const allRequiredPresent = requiredKeys.every((key) => {
      const value = values[key];
      return (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !isNaN(parseFloat(value))
      );
    });

    if (!allRequiredPresent) {
      return formula; // Return original formula if not all required values are present
    }
  }

  const variableMap = {};
  variables.forEach((variable) => {
    variableMap[variable.key] = variable.label;
  });

  const sortedVariables = Object.keys(values)
    .filter((key) => {
      const value = values[key];
      return value !== "" && value !== null && value !== undefined;
    })
    .map((key) => ({
      key,
      label: variableMap[key] || key,
      value: values[key],
    }))
    .sort((a, b) => b.label.length - a.label.length);

  const isWordChar = (char) => /[a-zA-Z0-9₀-₉μ]/.test(char);
  const isLetter = (char) => /[a-zA-Z₀-₉μ]/.test(char);
  const isDigit = (char) => /[0-9]/.test(char);

  let resultString = "";
  let i = 0;
  let lastReplacedWasValue = false;

  while (i < displayFormula.length) {
    let replaced = false;

    let longerVariableExists = false;
    const allVariableLabels = variables.map(
      (v) => variableMap[v.key] || v.label
    );
    for (const label of allVariableLabels) {
      if (label.length > 1 && i + label.length <= displayFormula.length) {
        const longerSubstring = displayFormula.substring(i, i + label.length);
        if (longerSubstring === label) {
          longerVariableExists = true;
          break;
        }
      }
    }

    for (const { label, value } of sortedVariables) {
      if (longerVariableExists && label.length === 1) {
        continue;
      }

      const formulaSubstring = displayFormula.substring(i, i + label.length);
      if (formulaSubstring === label) {
        const before = i === 0 ? "" : displayFormula[i - 1];
        const after = displayFormula[i + label.length] || "";

        const allVariableLabels = variables.map(
          (v) => variableMap[v.key] || v.label
        );

        const isMultiplication =
          after &&
          isLetter(after) &&
          (allVariableLabels.some((varLabel) => {
            return varLabel.length >= 1 && varLabel[0] === after;
          }) ||
            true);

        const isSecondInMultiplication =
          before &&
          (isLetter(before) || isDigit(before)) &&
          (isLetter(before)
            ? allVariableLabels.some((varLabel) => {
                return (
                  (varLabel.length === 1 && varLabel === before) ||
                  (varLabel.length > 1 &&
                    varLabel[varLabel.length - 1] === before)
                );
              }) || true
            : true);

        const prevEndsWithNumber =
          resultString.length > 0 && /[0-9.]$/.test(resultString);

        const validBefore =
          i === 0 ||
          !isWordChar(before) ||
          isSecondInMultiplication ||
          isDigit(before);
        const followedByWordChar = after && isWordChar(after);
        const validAfter = !followedByWordChar || isMultiplication;

        if (validBefore && validAfter) {
          const isInMultiplication =
            isMultiplication || isSecondInMultiplication;

          const needsParentheses =
            isInMultiplication &&
            (isMultiplication ||
              (prevEndsWithNumber && (isLetter(before) || isDigit(before))));

          if (needsParentheses) {
            resultString += `(${value})`;
          } else {
            resultString += value;
          }
          i += label.length;
          replaced = true;
          lastReplacedWasValue = true;
          break;
        }
      }
    }

    if (!replaced) {
      resultString += displayFormula[i];
      if (!isWordChar(displayFormula[i])) {
        lastReplacedWasValue = false;
      }
      i++;
    }
  }

  displayFormula = resultString;

  if (displayFormula.includes("g")) {
    let newFormula = "";
    for (let j = 0; j < displayFormula.length; j++) {
      if (displayFormula[j] === "g") {
        const before = j > 0 ? displayFormula[j - 1] : "";
        const after = displayFormula[j + 1] || "";
        const prevIsNumber = /[0-9.)]/.test(before);
        const nextIsNumber = /[0-9.(]/.test(after);

        if (prevIsNumber && nextIsNumber) {
          newFormula += "(9.8)";
        } else if (prevIsNumber) {
          newFormula += "(9.8)";
        } else if (nextIsNumber) {
          newFormula += "(9.8)";
        } else {
          newFormula += "9.8";
        }
      } else {
        newFormula += displayFormula[j];
      }
    }
    displayFormula = newFormula;
  }

  return displayFormula;
}
