# 📱 OmniCalc — Modern Calculator Web Application

A clean, responsive Calculator Web Application built with **React 19**, **TypeScript**, and **Tailwind CSS**. Developed for the **College App Development Domain Selection Task (1st Year)**.

---

##  Task Requirements Checklist

| # | Requirement | Implementation | Status |
|---|---|---|:---:|
| 1 | **Basic Arithmetic Operations** | Addition (`+`), Subtraction (`−`), Multiplication (`×`), and Division (`÷`) with PEMDAS order of operations and real-time live preview. | ✅ Complete |
| 2 | **Clear Button** | Dynamic `AC` / `C` key to reset calculations + single-digit backspace (`⌫`) to easily fix mistyped numbers. | ✅ Complete |
| 3 | **Display Numbers & Results** | Dual-line smart display: entered expression at the top, dynamic auto-shrinking output at the bottom (zero text clipping), and a 1-click Copy button. | ✅ Complete |
| 4 | **Attractive & Simple UI** | Clean, distraction-free aesthetic with tactile button feedback, smooth transitions, and subtle celebration confetti burst upon completing an equation. | ✅ Complete |
| 5 | **Extra: Percentage (`%`)** | Contextual percentage calculations (e.g., `200 + 10% = 220`, `50 × 20% = 10`, `50% = 0.5`). | ✅ Complete |
| 6 | **Extra: Dark Mode** | Clean, 1-click **Dark Mode** / **Light Mode** switch that persists your preference in `localStorage`. | ✅ Complete |
| 7 | **Bonus: Extended Basic Math** | Built-in Square Root (`√x`), Square (`x²`), Sign toggle (`±`), and Parentheses (`( )`) directly in the keypad. | ✅ Complete |
| 8 | **Bonus: Calculation Tape (History)** | Real-time calculation history with timestamps, 1-click recall into calculator, copy actions, and persistent storage. | ✅ Complete |
| 9 | **Bonus: Keyboard & Audio Feedback** | Full physical keyboard & numpad support + gentle mechanical keypress audio feedback synthesized via HTML5 Web Audio API. | ✅ Complete |

---

##  Highlights & Features

### 1. Dual-Line Smart Display with Confetti Animation
- **Top Expression Line**: Keeps track of the current equation as you type.
- **Bottom Output Line**: Formats numbers with readable comma separators and dynamically scales font size for large calculations.
- **Subtle Success Animation**: An elegant, subtle micro-confetti burst appears directly over the display upon finishing an equation.
- **Copy Button**: Quick copy to clipboard with instant feedback.

### 2. Contextual Percentage Engine
- Additive calculations: `200 + 15%` → `230` (Calculates 15% of 200, then adds)
- Subtractive discounts: `1000 - 20%` → `800` (Calculates 20% discount on 1000)
- Multiplicative: `50 × 10%` → `5`
- Standalone: `25%` → `0.25`

### 3. Extended Basic Operations
- Includes Square Root (`√x`), Square (`x²`), Plus/Minus sign toggle (`±`), and Parentheses (`( )`) seamlessly integrated without clutter.

### 4. Floating-Point Drift Correction
- Eliminates standard JavaScript binary floating-point rounding errors (like `0.1 + 0.2 = 0.30000000000000004`) using precision clamping via `toPrecision(12)` in `mathEngine.ts`.

### 5. Zero Division Safeguard
- Detects division-by-zero patterns (`5 ÷ 0`) and outputs `"Cannot divide by 0"` instead of crashing or returning `Infinity` / `NaN`.

### 6. Dark Mode & Light Mode
- Clean, natural toggle between a dark slate theme and crisp ivory theme. Fully integrated with Tailwind CSS.

### 7. Tactile Web Audio Synthesizer
- Built-in audio feedback using the browser's native **Web Audio API** (`OscillatorNode` and `GainNode`). Generates 35ms mechanical clicks without any external MP3 files. Can be muted anytime with the volume button.

---

## ⌨️ Physical Keyboard & Numpad Shortcuts

| Key | Action |
|---|---|
| `0` - `9` | Input digits |
| `.` | Decimal point (prevents duplicate decimals) |
| `+` | Addition |
| `-` | Subtraction |
| `*` or `x` | Multiplication |
| `/` | Division |
| `%` | Percentage |
| `^` | Power / Exponentiation |
| `(` and `)` | Parentheses |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last entered character |
| `Escape` or `c` / `C` | All Clear (AC) |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Engine**: Native HTML5 Web Audio API
- **Build Tool**: [Vite](https://vite.dev/)

---

## 📂 Project Structure

```text
├── index.html                  # HTML entry point with Google Fonts & metadata
├── package.json                # Project dependencies and build scripts
├── vite.config.ts              # Vite + Tailwind configuration
├── src/
│   ├── main.tsx                # React DOM entry point
│   ├── App.tsx                 # Main application controller & state orchestrator
│   ├── index.css               # Tailwind CSS v4 directives & theme declarations
│   ├── types/
│   │   └── calculator.ts       # TypeScript interfaces (Theme, History)
│   ├── utils/
│   │   ├── mathEngine.ts       # Arithmetic parser, float fix, percentage & validation
│   │   ├── audio.ts            # Web Audio API tactile keypress synthesizer
│   │   └── themes.ts           # Dark and Light mode styling configurations
│   └── components/
│       ├── Display.tsx         # Auto-scaling dual display with subtle confetti & copy
│       ├── Keypad.tsx          # Responsive tactile button grid with basic math operations
│       └── HistoryDrawer.tsx   # Chronological calculation tape with restore actions
└── README.md                   # Project documentation
```

---

##  Getting Started (Local Development)

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aditya3380-a11y/omnicalc-pro.git
   cd omnicalc-pro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000` (or the port specified by Vite).

5. **Build for production**:
   ```bash
   npm run build
   ```

---

##  Author

- **Name**: Aditya Pandey
- **GitHub**: [@aditya3380-a11y](https://github.com/aditya3380-a11y)
- **Domain**: Application Development (1st Year)

## 📄 License

MIT License
