export type ThemeId = 'dark' | 'light';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  isDark: boolean;
  bgMain: string;
  calculatorBg: string;
  displayBg: string;
  displayText: string;
  expressionText: string;
  keyNumberBg: string;
  keyNumberText: string;
  keyNumberHover: string;
  keyOperatorBg: string;
  keyOperatorText: string;
  keyOperatorHover: string;
  keyActionBg: string;
  keyActionText: string;
  keyActionHover: string;
  keyEqualsBg: string;
  keyEqualsText: string;
  keyEqualsHover: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  accent: string;
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type CalcMode = 'standard' | 'scientific';
