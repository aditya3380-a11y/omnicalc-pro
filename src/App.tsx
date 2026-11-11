import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  History,
  Calculator as CalcIcon,
  Sun,
  Moon,
  Download,
} from 'lucide-react';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ThemeId, HistoryItem } from './types/calculator';
import { THEMES } from './utils/themes';
import {
  evaluateExpression,
  isLastTokenOperator,
  getCurrentOperand,
  formatResult,
} from './utils/mathEngine';
import { soundEngine } from './utils/audio';

const STORAGE_KEY_HISTORY = 'omnicalc_history_v1';
const STORAGE_KEY_THEME = 'omnicalc_theme_v1';
const STORAGE_KEY_SOUND = 'omnicalc_sound_v1';

export default function App() {
  const [expression, setExpression] = useState<string>('');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dark / Light Theme state
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemeId;
      return saved && THEMES[saved] ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Sound state
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Mobile history drawer
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);

  const activeTheme = useMemo(() => THEMES[currentThemeId] || THEMES.dark, [currentThemeId]);

  // Synchronize HTML element classes for Tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (activeTheme.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, currentThemeId);
    } catch {}
  }, [currentThemeId, activeTheme.isDark]);

  // Synchronize sound engine
  useEffect(() => {
    soundEngine.enabled = soundOn;
    try {
      localStorage.setItem(STORAGE_KEY_SOUND, String(soundOn));
    } catch {}
  }, [soundOn]);

  // Synchronize history with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {}
  }, [history]);

  // Calculate live preview when expression is not yet evaluated
  const livePreview = useMemo(() => {
    if (isEvaluated || !expression || expression.trim() === '') return null;
    if (isLastTokenOperator(expression)) return null;

    const res = evaluateExpression(expression);
    if (res.success && res.result !== displayValue && res.result !== 'Error') {
      return res.result;
    }
    return null;
  }, [expression, displayValue, isEvaluated]);

  // Handlers for calculations
  const handleDigit = useCallback((digit: string) => {
    if (isEvaluated) {
      setExpression(digit === '.' ? '0.' : digit);
      setDisplayValue(digit === '.' ? '0.' : digit);
      setIsEvaluated(false);
      return;
    }

    const currentOperand = getCurrentOperand(expression);

    if (digit === '.' && currentOperand.includes('.')) {
      return;
    }

    if (digit === '.' && (!currentOperand || currentOperand === '')) {
      const newExpr = expression + '0.';
      setExpression(newExpr);
      setDisplayValue('0.');
      return;
    }

    if (currentOperand === '0' && digit !== '.') {
      const newExpr = expression.slice(0, -1) + digit;
      setExpression(newExpr);
      setDisplayValue(digit);
      return;
    }

    const newExpr = expression + digit;
    setExpression(newExpr);
    setDisplayValue(currentOperand + digit);
  }, [expression, isEvaluated]);

  const handleOperator = useCallback((op: string) => {
    if (isEvaluated) {
      const cleanPrev = displayValue.replace(/,/g, '');
      setExpression(cleanPrev + ' ' + op + ' ');
      setIsEvaluated(false);
      return;
    }

    if (!expression || expression.trim() === '') {
      if (op === '-') {
        setExpression('-');
        setDisplayValue('-');
      } else if (op === '(') {
        setExpression('(');
      }
      return;
    }

    const trimmed = expression.trimEnd();
    const lastChar = trimmed[trimmed.length - 1];

    if (['+', '-', '×', '÷', '^'].includes(lastChar)) {
      if (op === '-' && lastChar !== '-') {
        setExpression(expression + ' - ');
      } else {
        const cleaned = trimmed.slice(0, -1).trimEnd();
        setExpression(cleaned + ' ' + op + ' ');
      }
      return;
    }

    setExpression(expression + ' ' + op + ' ');
  }, [expression, isEvaluated, displayValue]);

  const handleSquareRoot = useCallback(() => {
    if (isEvaluated) {
      const num = parseFloat(displayValue.replace(/,/g, ''));
      if (num < 0) {
        setDisplayValue('Error');
        setExpression('');
        return;
      }
      const res = formatResult(Math.sqrt(num));
      setDisplayValue(res);
      setExpression(res);
      return;
    }

    if (!expression || expression.trim() === '' || isLastTokenOperator(expression)) {
      setExpression(expression + '√(');
      return;
    }

    const currentOperand = getCurrentOperand(expression);
    const num = parseFloat(currentOperand);
    if (!Number.isNaN(num) && num >= 0) {
      const res = formatResult(Math.sqrt(num));
      const start = expression.slice(0, expression.length - currentOperand.length);
      setExpression(start + res);
      setDisplayValue(res);
    } else {
      setExpression(expression + '√(');
    }
  }, [expression, isEvaluated, displayValue]);

  const handleSquare = useCallback(() => {
    if (isEvaluated) {
      const num = parseFloat(displayValue.replace(/,/g, ''));
      if (!Number.isNaN(num)) {
        const res = formatResult(Math.pow(num, 2));
        setDisplayValue(res);
        setExpression(res);
      }
      return;
    }

    if (!expression || expression.trim() === '' || isLastTokenOperator(expression)) {
      return;
    }

    setExpression(expression + '^2');
  }, [expression, isEvaluated, displayValue]);

  const handlePercentage = useCallback(() => {
    if (!expression || expression.trim() === '') return;
    if (isEvaluated) {
      const num = parseFloat(displayValue.replace(/,/g, ''));
      if (!Number.isNaN(num)) {
        const pct = formatResult(num / 100);
        setDisplayValue(pct);
        setExpression(pct);
      }
      return;
    }

    if (isLastTokenOperator(expression)) return;
    setExpression(expression + '%');
  }, [expression, isEvaluated, displayValue]);

  const handleToggleSign = useCallback(() => {
    if (isEvaluated) {
      const num = parseFloat(displayValue.replace(/,/g, ''));
      if (!Number.isNaN(num)) {
        const negated = formatResult(-num);
        setDisplayValue(negated);
        setExpression(negated);
      }
      return;
    }

    const currentOperand = getCurrentOperand(expression);
    if (!currentOperand || currentOperand === '0') return;

    if (currentOperand.startsWith('-')) {
      const pos = currentOperand.substring(1);
      const start = expression.slice(0, expression.length - currentOperand.length);
      const newExpr = start + pos;
      setExpression(newExpr);
      setDisplayValue(pos);
    } else {
      const start = expression.slice(0, expression.length - currentOperand.length);
      const newExpr = start + '-' + currentOperand;
      setExpression(newExpr);
      setDisplayValue('-' + currentOperand);
    }
  }, [expression, isEvaluated, displayValue]);

  const handleBackspace = useCallback(() => {
    if (isEvaluated) {
      setExpression('');
      setDisplayValue('0');
      setIsEvaluated(false);
      return;
    }

    if (!expression || expression.length <= 1) {
      setExpression('');
      setDisplayValue('0');
      return;
    }

    const trimmed = expression.trimEnd();
    const newExpr = trimmed.slice(0, -1).trimEnd();
    setExpression(newExpr);

    const remainingOperand = getCurrentOperand(newExpr);
    setDisplayValue(remainingOperand || '0');
  }, [expression, isEvaluated]);

  const handleClear = useCallback(() => {
    setExpression('');
    setDisplayValue('0');
    setIsEvaluated(false);
  }, []);

  const handleEquals = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    const evaluation = evaluateExpression(expression);

    if (evaluation.success) {
      setDisplayValue(evaluation.result);
      setIsEvaluated(true);

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression: expression,
        result: evaluation.result,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]);
    } else {
      setDisplayValue(evaluation.result || 'Error');
      setIsEvaluated(true);
    }
  }, [expression]);

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setExpression(item.result);
    setDisplayValue(item.result);
    setIsEvaluated(true);
    setIsHistoryDrawerOpen(false);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {}
  }, []);

  const toggleDarkLight = useCallback(() => {
    setCurrentThemeId((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key;

      if (key >= '0' && key <= '9') {
        soundEngine.playKeySound('number');
        handleDigit(key);
      } else if (key === '.') {
        soundEngine.playKeySound('number');
        handleDigit('.');
      } else if (key === '+') {
        e.preventDefault();
        soundEngine.playKeySound('operator');
        handleOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        soundEngine.playKeySound('operator');
        handleOperator('-');
      } else if (key === '*' || key === 'x' || key === 'X') {
        e.preventDefault();
        soundEngine.playKeySound('operator');
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        soundEngine.playKeySound('operator');
        handleOperator('÷');
      } else if (key === '%') {
        e.preventDefault();
        soundEngine.playKeySound('operator');
        handlePercentage();
      } else if (key === '^') {
        e.preventDefault();
        soundEngine.playKeySound('operator');
        handleOperator('^');
      } else if (key === '(' || key === ')') {
        soundEngine.playKeySound('operator');
        handleOperator(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        soundEngine.playKeySound('equals');
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        soundEngine.playKeySound('action');
        handleBackspace();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        e.preventDefault();
        soundEngine.playKeySound('action');
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEquals, handleBackspace, handleClear, handlePercentage]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex flex-col justify-between ${activeTheme.bgMain} selection:bg-indigo-500/30 selection:text-indigo-200`}
    >
      {/* Clean, authentic Top Bar */}
      <header
        className={`w-full border-b backdrop-blur-md sticky top-0 z-30 transition-colors ${
          activeTheme.isDark
            ? 'bg-slate-950/80 border-slate-800/80 text-slate-100'
            : 'bg-white/80 border-slate-200 text-slate-900'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm transition-colors"
              style={{ backgroundColor: activeTheme.accent }}
            >
              <CalcIcon className="w-5 h-5" />
            </div>
            <span className="text-base font-bold tracking-tight">
              OmniCalc
            </span>
          </div>

          {/* Right Action Controls: Audio Toggle, Dark/Light Mode, Mobile History */}
          <div className="flex items-center gap-2">
            {/* Download Project ZIP */}
            <a
              href="/omnicalc-project.zip"
              download="omnicalc-calculator-app.zip"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 active:scale-95 transition-all text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
              title="Download all project files in a ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download ZIP</span>
            </a>

            {/* Audio Feedback Toggle */}
            <button
              onClick={() => setSoundOn(!soundOn)}
              title={soundOn ? 'Key sound: On' : 'Key sound: Muted'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundOn
                  ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
                  : 'border-slate-700/30 text-slate-500 hover:text-slate-400'
              }`}
              aria-label="Toggle sound feedback"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Clean Dark / Light Mode Switch */}
            <button
              onClick={toggleDarkLight}
              title={activeTheme.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/30 hover:bg-white/5 active:scale-95 transition-all text-xs font-medium cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {activeTheme.isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-slate-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline text-slate-700">Dark</span>
                </>
              )}
            </button>

            {/* Mobile History Drawer Toggle */}
            <button
              onClick={() => setIsHistoryDrawerOpen(!isHistoryDrawerOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-700/30 text-slate-300 hover:text-white cursor-pointer relative"
              title="Calculation History"
              aria-label="Toggle history panel"
            >
              <History className="w-4 h-4" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Calculator Unit */}
          <div
            className={`w-full lg:col-span-7 rounded-3xl p-5 sm:p-7 border transition-all duration-300 ${activeTheme.calculatorBg}`}
          >
            {/* Display Component with subtle confetti celebration */}
            <div className="mb-4">
              <Display
                expression={expression}
                result={displayValue}
                livePreview={livePreview}
                theme={activeTheme}
                isEvaluated={isEvaluated}
              />
            </div>

            {/* Keypad Component */}
            <Keypad
              onDigit={handleDigit}
              onOperator={handleOperator}
              onClear={handleClear}
              onBackspace={handleBackspace}
              onEquals={handleEquals}
              onToggleSign={handleToggleSign}
              onPercentage={handlePercentage}
              onSquareRoot={handleSquareRoot}
              onSquare={handleSquare}
              theme={activeTheme}
              isAllClear={!expression && displayValue === '0'}
            />
          </div>

          {/* Right Column: Calculation Tape / History (Desktop side-by-side) */}
          <div className="w-full lg:col-span-5 hidden lg:block h-[510px]">
            <HistoryDrawer
              history={history}
              onSelectHistory={handleSelectHistory}
              onClearHistory={handleClearHistory}
              theme={activeTheme}
              isOpen={true}
            />
          </div>
        </div>

        {/* Mobile History Drawer overlay when open */}
        {isHistoryDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div
              className="fixed inset-0"
              onClick={() => setIsHistoryDrawerOpen(false)}
            />
            <div className="relative w-full max-w-md max-h-[80vh] rounded-3xl z-10 overflow-hidden shadow-2xl">
              <HistoryDrawer
                history={history}
                onSelectHistory={handleSelectHistory}
                onClearHistory={handleClearHistory}
                theme={activeTheme}
                isOpen={true}
                onClose={() => setIsHistoryDrawerOpen(false)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Clean, authentic human Footer */}
      <footer
        className={`w-full py-4 px-6 border-t text-xs text-center transition-colors ${
          activeTheme.isDark
            ? 'border-slate-800 text-slate-500'
            : 'border-slate-200 text-slate-500'
        }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <span>OmniCalc · Simple, fast, and modern calculator</span>
        </div>
      </footer>
    </div>
  );
}
