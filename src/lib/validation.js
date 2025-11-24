export function validateNumberInput(inputValue) {
  if (!inputValue || inputValue.trim() === "") {
    return { isValid: true, error: "" };
  }

  const validPattern = /^-?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

  if (!validPattern.test(inputValue)) {
    return { isValid: false, error: "Invalid number format" };
  }

  const numValue = parseFloat(inputValue);
  if (isNaN(numValue) || !isFinite(numValue)) {
    return { isValid: false, error: "Invalid number format" };
  }

  return { isValid: true, error: "" };
}
