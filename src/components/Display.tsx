import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../types/calculator';

interface DisplayProps {
  expression: string;
  result: string;
  livePreview: string | null;
  theme: ThemeConfig;
  isEvaluated: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  shape: 'circle' | 'rect';
  alpha: number;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  livePreview,
  theme,
  isEvaluated,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSuccessGlow, setShowSuccessGlow] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const handleCopy = () => {
    const textToCopy = isEvaluated ? result : (livePreview || result || expression);
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy.replace(/,/g, '')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  const getResultFontSize = (text: string) => {
    const len = text.length;
    if (len > 16) return 'text-2xl sm:text-3xl';
    if (len > 12) return 'text-3xl sm:text-4xl';
    if (len > 8) return 'text-4xl sm:text-5xl';
    return 'text-5xl sm:text-6xl';
  };

  // Subtle Confetti & Success Animation trigger when equation finishes
  useEffect(() => {
    if (!isEvaluated) return;
    if (result === 'Error' || result.includes('Cannot divide')) return;

    setShowSuccessGlow(true);
    const glowTimer = setTimeout(() => setShowSuccessGlow(false), 1400);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];
    const particles: Particle[] = [];
    const particleCount = 28;

    const originX = width * 0.75;
    const originY = height * 0.65;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4.5;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 3 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
        alpha: 1,
      });
    }

    let frameCount = 0;
    const maxFrames = 65;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (const p of particles) {
        if (p.alpha <= 0.02) continue;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.vx *= 0.98;
        p.rotation += p.vRot;
        p.alpha = Math.max(0, 1 - frameCount / maxFrames);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size * 1.4, p.size * 0.8);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      frameCount++;
      if (alive && frameCount < maxFrames) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      clearTimeout(glowTimer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isEvaluated, result]);

  return (
    <div
      className={`relative w-full rounded-2xl p-5 sm:p-6 transition-all duration-300 border flex flex-col justify-between min-h-[148px] sm:min-h-[168px] overflow-hidden ${
        theme.displayBg
      } ${
        showSuccessGlow
          ? 'ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
          : ''
      }`}
    >
      {/* Canvas for subtle confetti burst */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Top Bar inside Display: Status & Copy action */}
      <div className="flex items-center justify-between gap-2 text-xs relative z-20">
        <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] select-none flex items-center gap-1">
          {isEvaluated ? (
            <>
              <Sparkles className="w-3 h-3 text-emerald-400 inline" />
              <span>Result</span>
            </>
          ) : (
            'Calculation'
          )}
        </span>

        <button
          onClick={handleCopy}
          aria-label="Copy to clipboard"
          title="Copy result to clipboard"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-[11px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px] opacity-75">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Middle Line: Full Expression */}
      <div className="w-full text-right overflow-x-auto whitespace-nowrap py-1 scrollbar-none relative z-20">
        <span
          className={`font-mono text-sm sm:text-base font-normal tracking-wide transition-colors ${theme.expressionText}`}
        >
          {expression || ' '}
        </span>
      </div>

      {/* Bottom Line: Main Value + Live Preview */}
      <div className="w-full flex items-baseline justify-end gap-3 overflow-x-auto overflow-y-hidden scrollbar-none relative z-20">
        {livePreview && !isEvaluated && (
          <span className="text-xs sm:text-sm font-mono text-slate-400/80 shrink-0 select-none">
            = {livePreview}
          </span>
        )}
        <div
          className={`font-mono font-bold tracking-tight select-all tabular-nums transition-all ${getResultFontSize(
            result
          )} ${theme.displayText}`}
        >
          {result}
        </div>
      </div>
    </div>
  );
};
