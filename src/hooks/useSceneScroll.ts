import { useState, useRef, useEffect, useCallback } from "react";

export interface SceneScrollState {
  scene: number;
  transitioning: boolean;
  direction: "up" | "down" | null;
}

interface UseSceneScrollOptions {
  totalScenes: number;
  transitionMs?: number;
}

export function useSceneScroll({ totalScenes, transitionMs = 800 }: UseSceneScrollOptions) {
  const [state, setState] = useState<SceneScrollState>({
    scene: 0, transitioning: false, direction: null,
  });
  const lockRef = useRef(false);
  const accumulated = useRef(0);
  const threshold = 60;

  const sceneRef = useRef(state.scene);
  sceneRef.current = state.scene;

  const goTo = useCallback((target: number) => {
    if (lockRef.current) return;
    if (target < 0 || target >= totalScenes) return;
    const dir = target > state.scene ? "down" : "up";
    lockRef.current = true;
    setState({ scene: target, transitioning: true, direction: dir });
    setTimeout(() => {
      lockRef.current = false;
      setState((s) => ({ ...s, transitioning: false, direction: null }));
    }, transitionMs);
  }, [state.scene, totalScenes, transitionMs]);

  const next = useCallback(() => goTo(state.scene + 1), [goTo, state.scene]);
  const prev = useCallback(() => goTo(state.scene - 1), [goTo, state.scene]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (lockRef.current) return;
      // On portfolio scene (index 2), don't intercept — let cards scroll
      if (sceneRef.current === 2) return;
      accumulated.current += e.deltaY;
      if (accumulated.current > threshold) {
        accumulated.current = 0;
        if (state.scene < totalScenes - 1) next();
      } else if (accumulated.current < -threshold) {
        accumulated.current = 0;
        if (state.scene > 0) prev();
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      if (lockRef.current) return;
      if (sceneRef.current === 2) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (dy > 50) { if (state.scene < totalScenes - 1) next(); }
      else if (dy < -50) { if (state.scene > 0) prev(); }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [totalScenes, next, prev, state.scene]);

  return { ...state, goTo, next, prev, lockRef };
}
