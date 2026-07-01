"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TabId = "silk" | "metallic";

type Particle = {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  angle: number;
  age: number;
  colorIndex: number;
  glintPhase: number;
};

const SILK_COLORS = ["#ffffff", "#f5f0ea", "#fdfaf5", "#ede8e0"];
const METALLIC_COLORS = ["#f5c542", "#d4af37", "#c0c0c0", "#e8e8e8", "#ffd700"];

function makeParticle(canvasWidth: number, tab: TabId): Particle {
  const isSilk = tab === "silk";
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * -200,
    w: isSilk ? 6 + Math.random() * 4 : 4 + Math.random() * 4,
    h: isSilk ? 3 + Math.random() * 2 : 2 + Math.random() * 2,
    speed: isSilk ? 0.5 + Math.random() * 0.7 : 1.5 + Math.random() * 1.3,
    angle: Math.random() * Math.PI * 2,
    age: Math.random() * 200,
    colorIndex: Math.floor(Math.random() * (isSilk ? SILK_COLORS.length : METALLIC_COLORS.length)),
    glintPhase: Math.random() * Math.PI * 2,
  };
}

const CANVAS_HEIGHT = 220;

export default function ConfettiFallSimulator() {
  const [tab, setTab] = useState<TabId>("silk");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const tabRef = useRef<TabId>(tab);

  tabRef.current = tab;

  const drawStatic = useCallback((ctx: CanvasRenderingContext2D, w: number, currentTab: TabId) => {
    ctx.clearRect(0, 0, w, CANVAS_HEIGHT);
    const colors = currentTab === "silk" ? SILK_COLORS : METALLIC_COLORS;
    for (let i = 0; i < 70; i++) {
      const x = Math.random() * w;
      const y = Math.random() * CANVAS_HEIGHT;
      const pw = currentTab === "silk" ? 6 + Math.random() * 4 : 4 + Math.random() * 4;
      const ph = currentTab === "silk" ? 3 + Math.random() * 2 : 2 + Math.random() * 2;
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI * 2);
      ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
      ctx.restore();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawStatic(ctx, canvas.width, tab);
      return;
    }

    const COUNT = 70;
    particlesRef.current = Array.from({ length: COUNT }, () =>
      makeParticle(canvas.width, tab),
    ).map((p) => ({ ...p, y: Math.random() * CANVAS_HEIGHT }));

    const colors = tab === "silk" ? SILK_COLORS : METALLIC_COLORS;

    function loop() {
      const w = canvas!.width;
      ctx!.clearRect(0, 0, w, CANVAS_HEIGHT);

      for (const p of particlesRef.current) {
        p.age += 1;
        if (tabRef.current === "silk") {
          p.x += Math.sin(p.age * 0.04) * 0.8;
        }
        p.y += p.speed;
        if (p.y > CANVAS_HEIGHT + 10) {
          p.y = -10;
          p.x = Math.random() * w;
          p.age = 0;
        }

        ctx!.save();
        const alpha =
          tabRef.current === "metallic"
            ? 0.5 + 0.5 * Math.sin(p.age * 0.1 + p.glintPhase)
            : 0.7 + 0.25 * Math.random();
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = colors[p.colorIndex % colors.length];
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.angle + p.age * 0.02);
        ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx!.restore();
      }

      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [tab, drawStatic]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
    });
    observer.observe(canvas);
    canvas.width = canvas.offsetWidth;
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex border-b border-border" role="tablist">
        {(["silk", "metallic"] as TabId[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t
                ? "bg-surface text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "silk" ? "נייר משי" : "מטאלי מוזהב"}
          </button>
        ))}
      </div>
      <p className="sr-only">
        {tab === "silk"
          ? "אנימציה של קונפטי משי לבן הנוחת באיטיות"
          : "אנימציה של קונפטי מטאלי מוזהב הנופל מהר ומנצנץ"}
      </p>
      <canvas
        ref={canvasRef}
        height={CANVAS_HEIGHT}
        aria-hidden="true"
        className="block w-full"
        style={{ height: CANVAS_HEIGHT }}
      />
    </div>
  );
}
