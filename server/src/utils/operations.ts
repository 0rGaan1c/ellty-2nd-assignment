export const calculateOperation = (
  left: number,
  operation: string,
  right: number
): number => {
  switch (operation) {
    case "ADD":
      return left + right;
    case "SUBTRACT":
      return left - right;
    case "MULTIPLY":
      return left * right;
    case "DIVIDE":
      if (right === 0) throw new Error("Cannot divide by zero");
      return left / right;
    default:
      throw new Error("Invalid operation");
  }
};
