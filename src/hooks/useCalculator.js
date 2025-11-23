import { useState, useEffect, useRef } from "react";
import { calculate } from "@/lib/api";
import { getFormulaById, FORMULAS } from "@/lib/formulas";

export function useCalculator(selectedFormulaId = "velocity") {
  const formulaConfig = getFormulaById(selectedFormulaId) || FORMULAS.velocity;

  const getInitialValues = (config) => {
    return config.variables.reduce((acc, variable) => {
      acc[variable.key] = "";
      return acc;
    }, {});
  };

  const [values, setValues] = useState(() => getInitialValues(formulaConfig));
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);
  const skipResetRef = useRef(false);

  useEffect(() => {
    if (skipResetRef.current) {
      skipResetRef.current = false;
      return;
    }

    const newValues = getInitialValues(formulaConfig);
    setValues(newValues);
    setResult(null);
    setError(null);
  }, [selectedFormulaId, formulaConfig]);

  const handleValueChange = (variable, value) => {
    setValues((prev) => ({
      ...prev,
      [variable]: value,
    }));
    setError(null);
  };

  const clearInputs = () => {
    const clearedValues = getInitialValues(formulaConfig);
    setValues(clearedValues);
    setResult(null);
    setError(null);
  };

  const canCalculate = () => {
    const allVariables = formulaConfig.variables.map((v) => v.key);
    const allFilled = allVariables.every((key) => {
      const value = values[key];
      return (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !isNaN(parseFloat(value))
      );
    });

    const requiredFilled =
      formulaConfig.required.length === 0
        ? true
        : formulaConfig.required.every((key) => {
            const value = values[key];
            return (
              value !== "" &&
              value !== null &&
              value !== undefined &&
              !isNaN(parseFloat(value))
            );
          });

    return allFilled && requiredFilled;
  };

  const performCalculation = async () => {
    if (!canCalculate()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      const requestData = {};
      Object.keys(values).forEach((key) => {
        const value = values[key];
        if (value !== "" && value !== null && value !== undefined) {
          requestData[key] = parseFloat(value);
        }
      });

      const response = await calculate(formulaConfig.endpoint, requestData);
      setResult(response[formulaConfig.resultKey] || response.result);
    } catch (err) {
      setError(err.message || "Calculation failed. Please check your inputs.");
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  // Auto-calculate when values change
  useEffect(() => {
    if (canCalculate()) {
      const timer = setTimeout(() => {
        performCalculation();
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, selectedFormulaId]);

  const setValuesDirectly = (newValues) => {
    const validValues = {};
    formulaConfig.variables.forEach((variable) => {
      if (newValues.hasOwnProperty(variable.key)) {
        validValues[variable.key] = newValues[variable.key];
      }
    });

    skipResetRef.current = true;

    setValues((prev) => {
      const merged = { ...prev };
      Object.keys(validValues).forEach((key) => {
        merged[key] = validValues[key];
      });
      return merged;
    });
    setError(null);
  };

  return {
    formulaConfig,
    values,
    result,
    isCalculating,
    error,
    handleValueChange,
    clearInputs,
    setValuesDirectly,
  };
}
