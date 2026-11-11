/**
 * Mathematical Engine for OmniCalc Pro
 * Handles expression parsing, floating point precision corrections,
 * percentage rules, scientific operations, and division-by-zero checks.
 */

export const OPERATORS = ['+', '-', '×', '÷', '^', '%'] as const;
export type Operator = typeof OPERATORS[number];

/**
 * Cleanly format numbers, eliminating floating point drift like 0.1 + 0.2 = 0.30000000000000004
 */
export function formatResult(value: number): string {
  if (Number.isNaN(value)) return 'Error';
  if (!Number.isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';

  // If integer within safe range
  if (Number.isInteger(value) && Math.abs(value) < 1e14) {
    return value.toLocaleString('en-US');
  }

  // Handle scientific notation for extremely large/small values
  if (Math.abs(value) >= 1e14 || (Math.abs(value) > 0 && Math.abs(value) < 1e-9)) {
    return value.toExponential(6).replace('e+', 'e');
  }

  // Round to 10 significant decimal places to eliminate float artifacts
  const rounded = parseFloat(value.toPrecision(12));
  
  // Format with localized thousands separator while maintaining decimals
  const parts = rounded.toString().split('.');
  parts[0] = Number(parts[0]).toLocaleString('en-US');
  return parts.join('.');
}

/**
 * Remove commas and formatting for calculations
 */
export function sanitizeNumber(str: string): string {
  return str.replace(/,/g, '');
}

/**
 * Tokenize and safely evaluate an arithmetic expression string
 */
export function evaluateExpression(expr: string): { success: boolean; result: string; numericValue?: number; error?: string } {
  if (!expr || expr.trim() === '') {
    return { success: true, result: '0', numericValue: 0 };
  }

  try {
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/e(?![a-zA-Z0-9])/g, `(${Math.E})`)
      .replace(/,/g, '');

    // Replace square root patterns like √(number) or √number with Math.sqrt
    sanitized = sanitized.replace(/√\(([^\)]+)\)/g, 'Math.sqrt($1)');
    sanitized = sanitized.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');

    // Replace exponentiation ^ with **
    sanitized = sanitized.replace(/\^/g, '**');

    // Handle percentage calculations:
    // Case 1: `A + B%` -> `A + (A * (B/100))`
    // Case 2: `A - B%` -> `A - (A * (B/100))`
    // Case 3: `A * B%` -> `A * (B/100)`
    // Case 4: standalone `B%` -> `(B/100)`
    sanitized = sanitized.replace(/(\d+(\.\d+)?)\s*([\+\-])\s*(\d+(\.\d+)?)\s*%/g, (_match, a, _aDec, op, b) => {
      return `${a} ${op} (${a} * (${b} / 100))`;
    });
    sanitized = sanitized.replace(/(\d+(\.\d+)?)\s*%/g, '($1 / 100)');

    // Check for obvious division by zero: `/ 0` not followed by `.nonZero`
    if (/\/(\s*0+(\.0+)?(\s*[\+\-\*\/\)]|$))/.test(sanitized)) {
      return { success: false, result: 'Cannot divide by 0', error: 'Divide by Zero' };
    }

    // Guard against dangerous characters
    if (!/^[0-9\+\-\*\/\.\(\)\sMath\.sqrte\*\*\^]+$/.test(sanitized)) {
      return { success: false, result: 'Invalid Syntax', error: 'Invalid characters' };
    }

    // Safely evaluate using Function constructor with no scope access
    const evaluator = new Function(`
      "use strict";
      try {
        const val = (${sanitized});
        return val;
      } catch (e) {
        return NaN;
      }
    `);

    const evalResult = evaluator();

    if (typeof evalResult !== 'number' || Number.isNaN(evalResult)) {
      return { success: false, result: 'Error', error: 'Evaluation failed' };
    }

    if (!Number.isFinite(evalResult)) {
      return { success: false, result: 'Cannot divide by 0', error: 'Infinity' };
    }

    const formatted = formatResult(evalResult);
    return { success: true, result: formatted, numericValue: evalResult };
  } catch (err) {
    return { success: false, result: 'Error', error: (err as Error).message };
  }
}

/**
 * Check if the last token is an operator
 */
export function isLastTokenOperator(expr: string): boolean {
  const trimmed = expr.trimEnd();
  const lastChar = trimmed[trimmed.length - 1];
  return ['+', '-', '×', '÷', '^', '%'].includes(lastChar);
}

/**
 * Get the current number operand being typed (from the last operator or start)
 */
export function getCurrentOperand(expr: string): string {
  const parts = expr.split(/[\+\-×÷\^\(\)]/);
  return parts[parts.length - 1] || '';
}
