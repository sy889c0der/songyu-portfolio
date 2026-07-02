import { useEffect, useRef, useMemo } from "react";

interface NatureBackgroundProps {
  mouseX?: number;
  mouseY?: number;
  density?: "full" | "light";
}

interface StarDef  { left: string; top: string; size: number; twDur: number; twDelay: number; drDur: number; drDelay: number; }
interface LeafDef  { left: string; top: string; w: number; h: number; bg: string; animName: string; dur: number; delay: number; }
interface FlyDef   { left: string; top: string; dur: number; delay: number; }

export default function NatureBackground({ mouseX = 0, mouseY = 0, density = "full" }: NatureBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const stars = useMemo<StarDef[]>(() => {
    const n = density === "light" ? 35 : 65;
    return Array.from({ length: n }, (_, i) => {
      const s = (i * 137.508 + 31) % 360;
      return {
        left: `${(s * 7 + 13) % 100}%`,
        top:  `${(s * 11 + 7) % 100}%`,
        size: 1 + (s % 4),
        twDur: 2.2 + (s % 4) * 1.1,
        twDelay: (s % 6) * 0.6,
        drDur: 14 + (s % 10),
        drDelay: (s % 8) * 1.8,
      };
    });
  }, [density]);

  const leaves = useMemo<LeafDef[]>(() => {
    const n = density === "light" ? 5 : 14;
    return Array.from({ length: n }, (_, i) => ({
      left: `${3 + (i * 19) % 94}%`,
      top:  `${2 + (i * 23) % 96}%`,
      w: 5 + (i % 9),
      h: 7 + (i % 12),
      bg: i % 3 === 0 ? "rgba(75,145,55,0.22)" : i % 3 === 1 ? "rgba(55,125,45,0.18)" : "rgba(95,165,65,0.16)",
      animName: i % 2 === 0 ? "leafFloatA" : "leafFloatB",
      dur: 11 + (i % 9),
      delay: i * 0.75,
    }));
  }, [density]);

  const fireflies = useMemo<FlyDef[]>(() => {
    const n = density === "light" ? 4 : 9;
    return Array.from({ length: n }, (_, i) => ({
      left: `${8 + (i * 17 + 5) % 84}%`,
      top:  `${6 + (i * 13 + 3) % 88}%`,
      dur: 6.5 + (i % 5) * 1.6,
      delay: i * 1.3,
    }));
  }, [density]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.transform = `translate(${mouseX * 14}px, ${mouseY * 9}px)`;
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="stars-layer" style={{ transition: "transform 0.7s ease-out" }}>
      {/* Stars */}
      {stars.map((s, i) => (
        <div key={`st-${i}`} className="star-dot" style={{
          left: s.left, top: s.top, width: s.size, height: s.size,
          "--tw-dur": `${s.twDur}s`, "--tw-delay": `${s.twDelay}s`,
          "--dr-dur": `${s.drDur}s`, "--dr-delay": `${s.drDelay}s`,
        } as React.CSSProperties} />
      ))}

      {/* Leaves */}
      {leaves.map((l, i) => (
        <div key={`lf-${i}`} className="botanical-particle" style={{
          left: l.left, top: l.top, width: l.w, height: l.h,
          background: l.bg,
          animation: `${l.animName} ${l.dur}s ease-in-out infinite`,
          animationDelay: `${l.delay}s`,
        }} />
      ))}

      {/* Fireflies */}
      {fireflies.map((f, i) => (
        <div key={`ff-${i}`} className="firefly-dot" style={{
          left: f.left, top: f.top,
          "--fw-dur": `${f.dur}s`, "--fw-delay": `${f.delay}s`,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}
