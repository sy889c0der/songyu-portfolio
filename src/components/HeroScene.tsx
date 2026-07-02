import { useEffect, useRef, useState, useCallback } from "react";
import RevealLayer from "./RevealLayer";
import NatureBackground from "./NatureBackground";

const BG_IMAGE_1 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_IMAGE_2 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";

interface CursorPos { x: number; y: number; }

interface HeroSceneProps {
  active: boolean;
  goTo: (scene: number) => void;
  onNext: () => void;
}

export default function HeroScene({ active, goTo, onNext }: HeroSceneProps) {
  const mouse = useRef<CursorPos>({ x: 0, y: 0 });
  const smooth = useRef<CursorPos>({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const [cursorPos, setCursorPos] = useState<CursorPos>({ x: -999, y: -999 });
  const [bgMouse, setBgMouse] = useState<CursorPos>({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    setBgMouse({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
  }, []);

  useEffect(() => {
    if (!active) return;
    document.addEventListener("mousemove", onMouseMove);
    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ ...smooth.current });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { document.removeEventListener("mousemove", onMouseMove); cancelAnimationFrame(rafRef.current); };
  }, [active, onMouseMove]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black"
      style={{ fontFamily: "'Inter', sans-serif", visibility: active ? "visible" : "hidden" }}>
      <NatureBackground mouseX={bgMouse.x} mouseY={bgMouse.y} density="light" />

      <div className={`absolute inset-0 ${active ? "hero-zoom" : ""}`}
        style={{ zIndex: 10, backgroundImage: `url(${BG_IMAGE_1})`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat" }} />

      {/* Green canopy fades */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 12 }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "26%",
          background: "linear-gradient(to bottom, rgba(3,10,3,0.68) 0%, rgba(6,16,5,0.3) 50%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "22%",
          background: "linear-gradient(to top, rgba(2,8,2,0.68) 0%, rgba(4,12,4,0.25) 50%, transparent 100%)" }} />
      </div>

      {active && <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />}

      {/* Heading */}
      <div className="absolute top-[12%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none" style={{ zIndex: 50 }}>
        <h1 className="text-white leading-[0.94]">
          <span className={`block font-playfair italic font-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl ${active ? "hero-anim hero-reveal" : ""}`}
            style={{ letterSpacing: "-0.03em", animationDelay: active ? "0.2s" : "0s" }}>
            Song Yu's
          </span>
          <span className={`block font-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl -mt-1 ${active ? "hero-anim hero-reveal" : ""}`}
            style={{ letterSpacing: "-0.05em", animationDelay: active ? "0.38s" : "0s" }}>
            Portfolio
          </span>
        </h1>
        <p className={`mt-5 text-white/32 text-sm sm:text-base max-w-lg leading-relaxed ${active ? "hero-anim hero-fade" : ""}`}
          style={{ animationDelay: active ? "0.55s" : "0s" }}>
          Design is a living ecosystem. Each project a seed, each pixel a leaf,
          growing into a forest of creative work.
        </p>
      </div>

      {/* Bottom-left */}
      <div className={`hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[270px] ${active ? "hero-anim hero-fade" : ""}`}
        style={{ zIndex: 50, animationDelay: active ? "0.7s" : "0s" }}>
        <p className="text-sm text-white/80 leading-relaxed">
          From Figma prototypes to Unity groves, from data blooms to product
          flora — cultivating digital ecosystems, one project at a time.
        </p>
      </div>

      {/* Bottom-right */}
      <div className={`absolute bottom-10 left-5 right-5 sm:bottom-24 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[270px] flex flex-col items-start gap-4 sm:gap-5 ${active ? "hero-anim hero-fade" : ""}`}
        style={{ zIndex: 50, animationDelay: active ? "0.85s" : "0s" }}>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          Step into the grove. Explore the work, the process, and the living
          systems behind each creative harvest.
        </p>
        <button onClick={onNext}
          className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30">
          Explore Works
        </button>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center p-4 sm:p-5 pointer-events-none">
        <div className="pointer-events-auto flex bg-white/8 backdrop-blur-md border border-white/12 rounded-full px-2 py-2 items-center gap-0.5">
          {["Home", "About", "Works", "Contact"].map((label, i) => (
            <button key={label} onClick={() => goTo(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${i === 0 ? "text-white bg-white/10" : "text-white/75 hover:bg-white/10 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
