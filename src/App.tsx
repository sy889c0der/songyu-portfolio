import { useState, useCallback } from "react";
import { useSceneScroll } from "./hooks/useSceneScroll";
import HeroScene from "./components/HeroScene";
import AboutScene from "./components/AboutScene";
import PortfolioScene from "./components/PortfolioScene";
import ContactScene from "./components/ContactScene";
import ProjectModal from "./components/ProjectModal";

interface Project {
  id: string; title: string; subtitle: string; description: string;
  fullDescription: string; tags: string[]; images: string[]; link?: string; accent?: string;
}

const TOTAL_SCENES = 4;

function App() {
  const { scene, transitioning, direction, next, goTo } = useSceneScroll({ totalScenes: TOTAL_SCENES, transitionMs: 800 });
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const handleOpen = useCallback((p: Project) => setModalProject(p), []);
  const handleClose = useCallback(() => setModalProject(null), []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black" style={{ fontFamily: "'Inter', sans-serif" }}>
      <HeroScene active={scene === 0} goTo={goTo} onNext={next} />
      <AboutScene active={scene === 1} transitioning={transitioning} />
      <PortfolioScene active={scene === 2} transitioning={transitioning} onOpenProject={handleOpen} />
      <ContactScene active={scene === 3} transitioning={transitioning} />

      {transitioning && <div className="scene-transition-overlay" key={`t-${direction}-${Date.now()}`} />}

      <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-[150] flex flex-col gap-3">
        {Array.from({ length: TOTAL_SCENES }).map((_, i) => (
          <button key={i} className={`scene-dot ${i === scene ? "active" : ""}`} onClick={() => goTo(i)}
            aria-label={`Scene ${i + 1}`} />
        ))}
      </div>

      {scene === 0 && !transitioning && (
        <div className="fixed bottom-6 left-0 right-0 z-[150] flex flex-col items-center gap-1 text-white/15 pointer-events-none">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to explore</span>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className="animate-bounce">
            <rect x="1" y="1" width="12" height="18" rx="6" stroke="currentColor" strokeWidth="1.5" />
            <rect x="6" y="4" width="2" height="4" rx="1" fill="currentColor">
              <animate attributeName="y" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
            </rect>
          </svg>
        </div>
      )}

      <ProjectModal project={modalProject} onClose={handleClose} />
    </div>
  );
}

export default App;
