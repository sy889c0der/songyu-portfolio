import { useRef, useEffect, useState, useCallback } from "react";
import { useVideoFrame } from "../hooks/useVideoFrame";
import NatureBackground from "./NatureBackground";

interface Project {
  id: string; title: string; subtitle: string; description: string;
  fullDescription: string; tags: string[]; images: string[];
  videoPreview?: string; link?: string; accent?: string;
}

const projects: Project[] = [
  {
    id: "figma", title: "Figma Prototype", subtitle: "Wuxi Wei \u00b7 UI Design System",
    description: "A complete mobile interaction prototype for the regional specialty 'Wuxi Wei', blending cultural heritage with modern UI language.",
    fullDescription: "Collaboration with Wang Hao. Centered on the regional specialty 'Wuxi Wei', this project maps the full user journey \u2014 from browsing to ordering \u2014 through a polished Figma prototype. Warm-toned ingredient showcases, streamlined order flows, and a branded visual symbol system bring local heritage into the digital space with warmth and clarity. Figma component variants and interactive prototyping features deliver a high-fidelity, clickable demo. Includes demo video documentation.",
    tags: ["Figma", "Prototyping", "UI/UX", "Interaction Design"],
    images: ["/portfolio/unity/\u5fae\u5c0f\u7684\u786e\u5b9a.jpg","/portfolio/web/\u81ea\u7136\u539f\u91ce.jpg"],
    accent: "#FF6B35",
  },
  {
    id: "web", title: "Interactive Web", subtitle: "Wild Fields \u2192 Mist Forest",
    description: "The evolution of a web experience \u2014 from serene static layout to immersive dynamic narrative with parallax and particle effects.",
    fullDescription: "A record of web evolution. 'Wild Fields' (v1) uses fresh natural tones, CSS flex layout, and clean typography for an open, airy browsing experience. 'Mist Forest' (v2) pivots to immersive storytelling \u2014 multi-layer parallax scrolling, CSS particle animation, mist overlays, and audio-reactive interactions \u2014 as if stepping into a breathing digital forest. Deployed on GitHub Pages, open source, with a dedicated API key system.",
    tags: ["HTML/CSS", "JavaScript", "Parallax", "Particles", "Open Source"],
    images: ["/portfolio/web/\u81ea\u7136\u539f\u91ce.jpg","/portfolio/web/11.jpg","/portfolio/unity/scenes/\u7a97\u4e2d\u82b1\u56ed.jpg"],
    link: "https://sy889c0der.github.io/wilderness",
    accent: "#4CAF50",
  },
  {
    id: "unity", title: "Unity Game Scene", subtitle: "Small Certainties \u00b7 Indoor Exploration",
    description: "A first-person exploration experience \u2014 nine meticulously crafted micro-spaces, each holding its own quiet narrative.",
    fullDescription: "Built around 'small but certain happiness,' this Unity experience features nine independently modeled spaces: a bookshelf corner crammed with volumes, a caf\u00e9 bathed in warm light, a window garden blooming in concrete, a wardrobe of old stories, a weathered sink mirror, crumbling ruins, a kitchen's warmth, a solitary ergonomic chair, and the first light of the start screen. The work explores the narrative potential of game engines beyond traditional gameplay.",
    tags: ["Unity", "3D Scenes", "Game Design", "Narrative"],
    images: ["/portfolio/unity/\u5fae\u5c0f\u7684\u786e\u5b9a.jpg","/portfolio/unity/scenes/\u5f00\u59cb.jpg","/portfolio/unity/scenes/\u4e66\u67dc.jpg","/portfolio/unity/scenes/\u5496\u5561\u5385.jpg","/portfolio/unity/scenes/\u7a97\u4e2d\u82b1\u56ed.jpg","/portfolio/unity/scenes/\u8863\u67dc.jpg"],
    accent: "#7C4DFF",
  },
  {
    id: "dataviz", title: "Data Visualization", subtitle: "AI Vector Infographics",
    description: "Vector infographics generated with AI-assisted design tools \u2014 turning complex datasets into clear, elegant visual narratives.",
    fullDescription: "Integrating AI toolchains into the traditional information design workflow. The output spans multiple themes and chart types \u2014 bar charts, donut charts, scatter plots, timeline infographics. Core philosophy: 'human-directed, machine-assisted' \u2014 AI handles iterative generation and layout suggestions, while the designer owns aesthetic judgment, narrative rhythm, and factual accuracy. The final set balances data rigor with visual impact.",
    tags: ["AI Design", "Vector Graphics", "Infographics", "Data Storytelling"],
    images: ["/portfolio/dataviz/1192230122\u5b8b\u5b87\u53ef\u89c6\u5316-300.jpg","/portfolio/spline/\u51e0\u4e4e\u5168\u6d41\u7a0b\u622a\u56fe.jpg"],
    accent: "#00BCD4",
  },
  {
    id: "zippo", title: "Zippo Product Design", subtitle: "Cyberpunk \u00b7 Laser Engraving",
    description: "A collaboration with Zippo \u2014 dark basalt base, gradient lacquer, and laser-engraved cyberpunk circuit patterns.",
    fullDescription: "A full-spectrum product design collaboration with Zippo, from concept to production-ready specifications. The cyberpunk visual language drives the aesthetic: matte black basalt-textured base serves as canvas, gradient lacquer creates a neon ambiance, and laser engraving on both front and back renders intricate circuit traces and futuristic city skyline motifs. The challenge: balancing subcultural edge with industrial manufacturability.",
    tags: ["Product Design", "Cyberpunk", "Laser Engraving", "Brand Collab"],
    images: ["/portfolio/zippo/\u6548\u679c\u56fe1.jpg","/portfolio/zippo/\u6548\u679c\u56fe2.jpg"],
    accent: "#E91E63",
  },
  {
    id: "spline", title: "Spline 3D Work", subtitle: "The Long March \u00b7 Supply Evolution",
    description: "An interactive historical narrative built in Spline 3D \u2014 merging spatial modeling with data visualization.",
    fullDescription: "Created with Spline 3D, centered on supply evolution during the Long March. The project fuses 3D spatial modeling with timeline-based data: viewers can orbit, zoom, and explore the scene as supply categories, quantities, and flows shift across each phase of the journey. An AI-assisted workflow covered everything from concept ideation and 3D asset generation to scene choreography. Includes full project documentation PDF and demo video.",
    tags: ["Spline", "3D Modeling", "Data Storytelling", "History Viz"],
    images: ["/portfolio/spline/\u51e0\u4e4e\u5168\u6d41\u7a0b\u622a\u56fe.jpg","/portfolio/zippo/\u6548\u679c\u56fe1.jpg"],
    accent: "#FF9800",
  },
];

interface CursorPos { x: number; y: number; }

interface PortfolioSceneProps {
  active: boolean; transitioning: boolean;
  onOpenProject: (project: Project) => void;
}

export default function PortfolioScene({ active, transitioning, onOpenProject }: PortfolioSceneProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mouse = useRef<CursorPos>({ x: 0, y: 0 });
  const smooth = useRef<CursorPos>({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState<CursorPos>({ x: 0, y: 0 });
  const [bgMouse, setBgMouse] = useState<CursorPos>({ x: 0, y: 0 });

  const scrollTarget = useRef<number | null>(null);
  const scrollRaf = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const el = scrollRef.current; if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollTarget.current === null) scrollTarget.current = el.scrollLeft;
      scrollTarget.current += e.deltaY * 0.75;
      scrollTarget.current = Math.max(0, Math.min(scrollTarget.current, el.scrollWidth - el.clientWidth));
    };
    const smoothLoop = () => {
      if (scrollTarget.current !== null && el) {
        const diff = scrollTarget.current - el.scrollLeft;
        if (Math.abs(diff) < 0.5) { el.scrollLeft = scrollTarget.current; scrollTarget.current = null; }
        else { el.scrollLeft += diff * 0.15; }
      }
      scrollRaf.current = requestAnimationFrame(smoothLoop);
    };
    scrollRaf.current = requestAnimationFrame(smoothLoop);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); cancelAnimationFrame(scrollRaf.current); };
  }, [active]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    setBgMouse({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
  }, []);

  useEffect(() => {
    if (!active) return;
    document.addEventListener("mousemove", onMouseMove);
    const loop = () => { smooth.current.x += (mouse.current.x - smooth.current.x) * 0.08; smooth.current.y += (mouse.current.y - smooth.current.y) * 0.08; setCursorPos({ ...smooth.current }); };
    const raf = requestAnimationFrame(loop);
    return () => { document.removeEventListener("mousemove", onMouseMove); cancelAnimationFrame(raf); };
  }, [active, onMouseMove]);

  return (
    <div className="absolute inset-0 bg-nature overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", visibility: active ? "visible" : "hidden" }}>
      <NatureBackground mouseX={bgMouse.x} mouseY={bgMouse.y} density="full" />

      <div className={`relative z-10 pt-16 sm:pt-20 pb-4 sm:pb-6 px-5 sm:px-8 ${active && !transitioning ? "scene-content-in" : ""}`}
        style={{ animationDelay: "0.1s" }}>
        <p className="text-[#e8702a]/80 text-xs sm:text-sm uppercase tracking-[0.25em] mb-2">Selected Works</p>
        <h2 className="font-playfair italic text-3xl sm:text-4xl md:text-5xl text-white">Portfolio</h2>
      </div>

      <div ref={scrollRef} className="horizontal-scroll relative z-10 pb-8 px-5 sm:px-8"
        style={{ height: "calc(100% - 140px)" }}>
        <div className="snap-center shrink-0 w-[calc(50vw-260px)] sm:w-[calc(50vw-280px)]" />
        {projects.map((p) => (
          <Card key={p.id} project={p} cursorX={cursorPos.x} cursorY={cursorPos.y} active={active} onOpen={() => onOpenProject(p)} />
        ))}
        <div className="snap-center shrink-0 w-[calc(50vw-260px)] sm:w-[calc(50vw-280px)]" />
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center text-white/10 text-[10px] uppercase tracking-[0.3em] z-10 pointer-events-none">
        Scroll to browse &nbsp;&larr;&nbsp;&rarr;
      </div>
    </div>
  );
}

function Card({ project, cursorX, cursorY, active, onOpen }: {
  project: Project; cursorX: number; cursorY: number; active: boolean; onOpen: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState<React.CSSProperties>({});
  const [parallax, setParallax] = useState<React.CSSProperties>({});
  const [imgIdx, setImgIdx] = useState(0);
  const videoFrame = useVideoFrame(project.videoPreview || null, 2);
  const previewSrc = videoFrame || project.images[imgIdx] || null;

  useEffect(() => {
    if (!active || project.images.length <= 1) return;
    const iv = setInterval(() => setImgIdx((i) => (i + 1) % project.images.length), 4000);
    return () => clearInterval(iv);
  }, [active, project.images.length]);

  useEffect(() => {
    if (!active) return;
    const card = cardRef.current; if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const dx = cursorX - cx, dy = cursorY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const intensity = Math.max(0, 1 - dist / Math.max(window.innerWidth, window.innerHeight));
    const gx = ((cursorX - rect.left) / rect.width) * 100;
    const gy = ((cursorY - rect.top) / rect.height) * 100;
    setGlow({
      background: `radial-gradient(circle at ${gx}% ${gy}%, ${project.accent || "#e8702a"}28 0%, transparent 65%)`,
      boxShadow: intensity > 0.2 ? `0 0 75px ${project.accent || "#e8702a"}${Math.round(intensity * 38).toString(16).padStart(2, "0")}, 0 0 150px ${project.accent || "#e8702a"}${Math.round(intensity * 15).toString(16).padStart(2, "0")}` : "none",
    });
    setParallax({ transform: `translate(${-dx * 0.012}px, ${-dy * 0.012}px) scale(1.06)` });
  }, [cursorX, cursorY, active, project.accent]);

  return (
    <div ref={cardRef} className="snap-center shrink-0 card-xl card-idle-float mx-3 sm:mx-4 relative rounded-2xl overflow-hidden border border-white/[0.06] cursor-pointer transition-all duration-600 ease-out hover:-translate-y-2 group"
      style={{ ...glow, backgroundColor: "rgba(8,22,6,0.45)" }}
      onClick={onOpen}>
      <div className="absolute inset-0 overflow-hidden">
        {previewSrc ? (
          <img src={previewSrc} alt={project.title}
            className="absolute inset-0 w-full h-full object-cover card-parallax-bg opacity-55 group-hover:opacity-78 saturation-[0.55] group-hover:saturation-[0.85]"
            style={{ ...parallax, transition: "transform 0.22s ease-out, opacity 0.6s, filter 0.6s" }} loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/[0.03] text-9xl font-playfair italic select-none">{project.title.charAt(0)}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-transparent to-transparent" />
      </div>
      {project.images.length > 1 && (
        <div className="absolute top-3 right-3 z-20 flex gap-1">
          {project.images.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{ background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.3)", boxShadow: i === imgIdx ? "0 0 6px rgba(255,255,255,0.5)" : "none" }} />
          ))}
        </div>
      )}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8">
        <div className="w-2 h-2 rounded-full mb-3" style={{ background: project.accent || "#e8702a" }} />
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">{project.subtitle}</p>
        <h3 className="font-playfair italic text-2xl sm:text-3xl text-white mb-3 leading-tight group-hover:text-[#e8702a] transition-colors duration-300">{project.title}</h3>
        <p className="text-white/42 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-white/35 border border-white/[0.04]">{t}</span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-white/30 group-hover:text-[#e8702a] transition-colors duration-300">
          <span>View Details</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
