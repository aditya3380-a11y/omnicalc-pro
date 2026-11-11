import React from 'react';
import { Delete } from 'lucide-react';
import { ThemeConfig } from '../types/calculator';
import { soundEngine } from '../utils/audio';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onSquareRoot: () => void;
  onSquare: () => void;
  theme: ThemeConfig;
  isAllClear: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onOperator,
  onClear,
  onBackspace,
  onEquals,
  onToggleSign,
  onPercentage,
  onSquareRoot,
  onSquare,
  theme,
  isAllClear,
}) => {
  const handlePress = (action: () => void, type: 'number' | 'operator' | 'action' | 'equals') => {
    soundEngine.playKeySound(type);
    action();
  };

  return (
    <div className="w-full flex flex-col gap-2.5 sm:gap-3">
      {/* Basic Math Operations Helper Row */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => handlePress(onSquareRoot, 'operator')}
          title="Square Root (√)"
          className={`h-11 rounded-xl font-mono text-sm font-semibold transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyActionBg}`}
        >
          <span>√x</span>
        </button>

        <button
          onClick={() => handlePress(onSquare, 'operator')}
          title="Square (x²)"
          className={`h-11 rounded-xl font-mono text-sm font-semibold transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyActionBg}`}
        >
          <span>x²</span>
        </button>

        <button
          onClick={() => handlePress(() => onOperator('('), 'operator')}
          title="Open Parenthesis ("
          className={`h-11 rounded-xl font-mono text-sm font-semibold transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyActionBg}`}
        >
          <span>(</span>
        </button>

        <button
          onClick={() => handlePress(() => onOperator(')'), 'operator')}
          title="Close Parenthesis )"
          className={`h-11 rounded-xl font-mono text-sm font-semibold transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyActionBg}`}
        >
          <span>)</span>
        </button>
      </div>

      {/* Main Keypad Grid: 4 columns */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {/* Row 1 */}
        <button
          onClick={() => handlePress(onClear, 'action')}
          className={`h-14 sm:h-16 rounded-2xl font-bold text-base sm:text-lg transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyActionBg}`}
          title="Clear calculation (Escape / C)"
        >
          {isAllClear ? 'AC' : 'C'}
        </button>

        <button
          onClick={() => handlePress(onBackspace, 'action')}
          className={`h-14 sm:h-16 rounded-2xl font-semibold transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyActionBg}`}
          title="Backspace / Delete last character (Backspace)"
        >
          <Delete className="w-5 h-5" />
        </button>

        <button
          onClick={() => handlePress(onPercentage, 'operator')}
          className={`h-14 sm:h-16 rounded-2xl font-bold text-lg sm:text-xl transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyOperatorBg}`}
          title="Percentage (%)"
        >
          %
        </button>

        <button
          onClick={() => handlePress(() => onOperator('÷'), 'operator')}
          className={`h-14 sm:h-16 rounded-2xl font-bold text-2xl transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyOperatorBg}`}
          title="Divide (/)"
        >
          ÷
        </button>

        {/* Row 2 */}
        {['7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handlePress(() => onDigit(digit), 'number')}
            className={`h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyNumberBg}`}
          >
            {digit}
          </button>
        ))}
        <button
          onClick={() => handlePress(() => onOperator('×'), 'operator')}
          className={`h-14 sm:h-16 rounded-2xl font-bold text-2xl transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyOperatorBg}`}
          title="Multiply (*)"
        >
          ×
        </button>

        {/* Row 3 */}
        {['4', '5', '6'].map((digit) => (
          <button
            key={digit}
            onClick={() => handlePress(() => onDigit(digit), 'number')}
            className={`h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyNumberBg}`}
          >
            {digit}
          </button>
        ))}
        <button
          onClick={() => handlePress(() => onOperator('-'), 'operator')}
          className={`h-14 sm:h-16 rounded-2xl font-bold text-2xl transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyOperatorBg}`}
          title="Subtract (-)"
        >
          −
        </button>

        {/* Row 4 */}
        {['1', '2', '3'].map((digit) => (
          <button
            key={digit}
            onClick={() => handlePress(() => onDigit(digit), 'number')}
            className={`h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyNumberBg}`}
          >
            {digit}
          </button>
        ))}
        <button
          onClick={() => handlePress(() => onOperator('+'), 'operator')}
          className={`h-14 sm:h-16 rounded-2xl font-bold text-2xl transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyOperatorBg}`}
          title="Add (+)"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handlePress(onToggleSign, 'action')}
          className={`h-14 sm:h-16 rounded-2xl font-semibold text-lg transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyActionBg}`}
          title="Toggle Positive / Negative (±)"
        >
          ±
        </button>

        <button
          onClick={() => handlePress(() => onDigit('0'), 'number')}
          className={`h-14 sm:h-16 rounded-2xl font-semibold text-xl sm:text-2xl transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyNumberBg}`}
        >
          0
        </button>

        <button
          onClick={() => handlePress(() => onDigit('.'), 'number')}
          className={`h-14 sm:h-16 rounded-2xl font-bold text-2xl transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyNumberBg}`}
          title="Decimal point (.)"
        >
          .
        </button>

        <button
          onClick={() => handlePress(onEquals, 'equals')}
          className={`h-14 sm:h-16 rounded-2xl font-bold text-2xl transition-all border active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer flex items-center justify-center ${theme.keyEqualsBg}`}
          title="Calculate result (Enter or =)"
        >
          =
        </button>
      </div>
    </div>
  );
};
