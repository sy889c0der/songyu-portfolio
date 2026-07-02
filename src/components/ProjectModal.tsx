import { useRef, useEffect, useState, useCallback } from "react";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import RevealLayer from "./RevealLayer";

interface Project {
  id: string; title: string; subtitle: string; description: string;
  fullDescription: string; tags: string[]; images: string[]; link?: string; accent?: string;
}

interface CursorPos { x: number; y: number; }

interface ProjectModalProps { project: Project | null; onClose: () => void; }

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const mouse = useRef<CursorPos>({ x: 0, y: 0 });
  const smooth = useRef<CursorPos>({ x: -999, y: -999 });
  const [cursorPos, setCursorPos] = useState<CursorPos>({ x: -999, y: -999 });
  const [isInContent, setIsInContent] = useState(false);
  const [bgPara, setBgPara] = useState<CursorPos>({ x: 0, y: 0 });
  const [carouselIdx, setCarouselIdx] = useState(0);
  const rafRef = useRef<number>(0);

  const onGM = useCallback((e: MouseEvent) => {
    setBgPara({ x: (e.clientX - window.innerWidth / 2) * 0.015, y: (e.clientY - window.innerHeight / 2) * 0.015 });
  }, []);

  const onMM = useCallback((e: MouseEvent) => {
    if (!contentRef.current) return;
    const r = contentRef.current.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    setIsInContent(inside);
    if (inside) mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  useEffect(() => {
    if (!project) return;
    document.addEventListener("mousemove", onMM);
    document.addEventListener("mousemove", onGM);
    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ ...smooth.current });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { document.removeEventListener("mousemove", onMM); document.removeEventListener("mousemove", onGM); cancelAnimationFrame(rafRef.current); };
  }, [project, onMM, onGM]);

  useEffect(() => {
    if (!project) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  useEffect(() => { setCarouselIdx(0); }, [project]);

  if (!project) return null;
  const imgs = project.images.length > 0 ? project.images : [];

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center overflow-y-auto py-8 sm:py-12 modal-backdrop"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Parallax bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {imgs.slice(0, 3).map((img, i) => (
          <div key={i} className="modal-parallax-layer opacity-[0.04] saturate-[0.25]" style={{
            transform: `translate(${bgPara.x * (1 + i * 0.5)}px, ${bgPara.y * (1 + i * 0.5)}px) scale(${1.2 + i * 0.1})`,
            backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center",
            filter: "blur(50px)", borderRadius: i === 0 ? "0" : "30% 70% 70% 30% / 30% 30% 70% 70%",
            left: `${i * 15}%`, top: `${i * 10}%`, width: `${70 - i * 10}%`, height: `${80 - i * 10}%`, zIndex: i,
          }} />
        ))}
      </div>

      <div ref={contentRef} className="modal-content relative w-full max-w-4xl mx-4 sm:mx-6 rounded-3xl overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif", background: "rgba(6,14,4,0.97)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(24px)" }}>
        {isInContent && imgs.length >= 2 && <RevealLayer image={imgs[1]} cursorX={cursorPos.x} cursorY={cursorPos.y} containerRef={contentRef} />}
        {isInContent && imgs.length === 1 && <RevealLayer image={imgs[0]} cursorX={cursorPos.x} cursorY={cursorPos.y} containerRef={contentRef} />}

        <button onClick={onClose} className="absolute top-4 right-4 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-black/45 text-white/70 hover:text-white hover:bg-black/65 transition-colors">
          <X size={18} />
        </button>

        {imgs.length > 0 && (
          <div className="relative w-full aspect-[16/7] overflow-hidden group/carousel">
            <div className="carousel-track w-full h-full">
              {imgs.map((img, i) => (
                <div key={i} className="carousel-slide">
                  <img src={img} alt={`${project.title} ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {imgs.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setCarouselIdx((i) => (i - 1 + imgs.length) % imgs.length); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/45 text-white/70 hover:text-white hover:bg-black/65 flex items-center justify-center transition-colors opacity-0 group-hover/carousel:opacity-100">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setCarouselIdx((i) => (i + 1) % imgs.length); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/45 text-white/70 hover:text-white hover:bg-black/65 flex items-center justify-center transition-colors opacity-0 group-hover/carousel:opacity-100">
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
                  {imgs.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === carouselIdx ? "bg-white scale-110" : "bg-white/40"}`} />
                  ))}
                </div>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,14,4,0.97)] via-black/25 to-transparent pointer-events-none" />
          </div>
        )}

        <div className="relative z-20 px-5 sm:px-10 py-6 sm:py-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="text-[10px] sm:text-[11px] px-3 py-1 rounded-full border"
                style={{ background: `${project.accent || "#e8702a"}10`, borderColor: `${project.accent || "#e8702a"}20`, color: project.accent || "#e8702a" }}>{tag}</span>
            ))}
          </div>
          <p className="text-white/32 text-xs sm:text-sm mb-2">{project.subtitle}</p>
          <h1 className="font-playfair italic text-2xl sm:text-3xl md:text-4xl text-white mb-6 leading-tight">{project.title}</h1>
          <p className="text-white/52 text-sm sm:text-base leading-relaxed mb-8 whitespace-pre-line">{project.fullDescription}</p>
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:shadow-lg"
              style={{ background: project.accent || "#e8702a", boxShadow: `0 0 26px ${project.accent || "#e8702a"}30` }}>
              <ExternalLink size={16} /> View Live Demo
            </a>
          )}
          {imgs.length === 0 && (
            <div className="mt-10 rounded-xl border border-white/[0.04] bg-white/[0.01] p-12 text-center text-white/18 text-sm">
              <div className="text-5xl mb-3 font-playfair italic">{project.title.charAt(0)}</div>
              <p>This project includes demo video and documentation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
