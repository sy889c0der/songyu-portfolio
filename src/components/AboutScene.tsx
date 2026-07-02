import { useState, useEffect, useCallback } from "react";
import NatureBackground from "./NatureBackground";

interface AboutSceneProps { active: boolean; transitioning: boolean; }

const skills = [
  { name: "Figma Prototyping",       level: 92 },
  { name: "HTML / CSS / JavaScript", level: 88 },
  { name: "Unity 3D Scenes",         level: 85 },
  { name: "AI-Assisted Design",      level: 90 },
  { name: "Product Visual Design",   level: 87 },
  { name: "Spline 3D Modeling",      level: 82 },
];

interface TrailStar { id: number; x: number; y: number; opacity: number; }

export default function AboutScene({ active, transitioning }: AboutSceneProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailStar[]>([]);
  let idCounter = 0;

  const onMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    const s: TrailStar = { id: ++idCounter + Math.random(), x: e.clientX, y: e.clientY, opacity: 0.85 };
    setTrail((prev) => [...prev.slice(-18), s]);
  }, []);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setTrail((prev) => prev.map((t) => ({ ...t, opacity: t.opacity - 0.045 })).filter((t) => t.opacity > 0));
    }, 45);
    return () => clearInterval(interval);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [active, onMouseMove]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-nature overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", visibility: active ? "visible" : "hidden" }}>
      <NatureBackground mouseX={mousePos.x} mouseY={mousePos.y} density="full" />

      {/* Cursor trail */}
      {trail.map((t) => (
        <div key={t.id} style={{
          position: "fixed", left: t.x, top: t.y, width: 3, height: 3,
          opacity: t.opacity, zIndex: 100, pointerEvents: "none",
          background: "rgba(195,235,155,0.8)", boxShadow: "0 0 7px 2px rgba(175,225,145,0.5)", borderRadius: "50%",
        }} />
      ))}

      <div className={`relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 py-12 ${active && !transitioning ? "scene-content-in" : ""}`}>
        <p className="text-[#e8702a]/80 text-xs sm:text-sm uppercase tracking-[0.25em] mb-3 text-center">About the Creator</p>

        {/* Avatar area */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-5">
            <div className="w-30 h-30 sm:w-34 sm:h-34 rounded-full overflow-hidden border-2 border-[#e8702a]/25 bg-gradient-to-br from-[#183610] to-[#0b1c06] flex items-center justify-center">
              <svg width="50" height="50" viewBox="0 0 48 48" fill="none" className="opacity-28">
                <circle cx="24" cy="17" r="9" stroke="rgba(232,112,42,0.5)" strokeWidth="1.5" />
                <path d="M10 39c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="rgba(232,112,42,0.5)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            {/* Decorative leaves around avatar */}
            <div className="absolute -inset-6 pointer-events-none">
              <div className="botanical-particle" style={{ left: -10, top: 18, width: 16, height: 22, background: "rgba(75,145,50,0.18)", animation: "leafFloatA 11s ease-in-out infinite", animationDelay: "0s" }} />
              <div className="botanical-particle" style={{ right: -12, top: 28, width: 13, height: 19, background: "rgba(55,125,38,0.16)", animation: "leafFloatB 12s ease-in-out infinite", animationDelay: "2.5s" }} />
              <div className="botanical-particle" style={{ left: 42, bottom: -4, width: 15, height: 21, background: "rgba(88,158,52,0.14)", animation: "leafFloatA 14s ease-in-out infinite", animationDelay: "5s" }} />
            </div>
          </div>
          <h2 className="font-playfair italic text-3xl sm:text-4xl md:text-5xl text-white text-center leading-tight">
            Song Yu
            <span className="block text-white/38 text-lg sm:text-xl not-italic mt-2 font-light">Designer &amp; Developer</span>
          </h2>
        </div>

        <p className="text-white/48 text-sm sm:text-base text-center max-w-2xl mx-auto leading-relaxed mb-11">
          Bridging design and development — from Figma prototypes to Unity 3D
          environments, from web animation to product visual identity. Each project
          is a seed planted, grown, and harvested into something living.
        </p>

        {/* Skill bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 max-w-xl mx-auto">
          {skills.map((skill) => (
            <div key={skill.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-white/58">{skill.name}</span>
                <span className="text-[#e8702a]/60">{skill.level}%</span>
              </div>
              <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full skill-bar-fill rounded-full transition-all duration-1200 ease-out"
                  style={{ width: active ? `${skill.level}%` : "0%", transitionDelay: active ? `${0.35 + skills.indexOf(skill) * 0.09}s` : "0s" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 text-white/10">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to explore works</span>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className="animate-bounce">
            <rect x="1" y="1" width="12" height="18" rx="6" stroke="currentColor" strokeWidth="1.5" />
            <rect x="6" y="4" width="2" height="4" rx="1" fill="currentColor">
              <animate attributeName="y" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
            </rect>
          </svg>
        </div>
      </div>
    </div>
  );
}
