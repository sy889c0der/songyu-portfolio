import { useEffect, useRef, useState, useMemo } from "react";

const SPOTLIGHT_R = 260;
const THROTTLE_MS = 32; // ~30fps for canvas updates

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
  /** If provided, spotlight is scoped to this element's bounds */
  containerRef?: React.RefObject<HTMLElement | null>;
}

export default function RevealLayer({ image, cursorX, cursorY, containerRef }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastDraw = useRef(0);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef?.current) {
        const r = containerRef.current.getBoundingClientRect();
        setCanvasSize({ w: r.width, h: r.height });
      } else {
        setCanvasSize({ w: window.innerWidth, h: window.innerHeight });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [containerRef]);

  // Memoize canvas drawing — only runs when cursor/size actually changes
  useEffect(() => {
    // Throttle: skip frames that are too close together
    const now = performance.now();
    if (now - lastDraw.current < THROTTLE_MS) return;
    lastDraw.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = canvasSize;
    if (w === 0 || h === 0) return;

    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);

    const gradient = ctx.createRadialGradient(
      cursorX, cursorY, 0,
      cursorX, cursorY, SPOTLIGHT_R
    );

    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.75)");
    gradient.addColorStop(0.75, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(0.88, "rgba(255, 255, 255, 0.12)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();
  }, [cursorX, cursorY, canvasSize]);

  const maskUrl = useMemo(() => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    return `url(${canvas.toDataURL()})`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorX, cursorY, canvasSize.w, canvasSize.h]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          maskImage: maskUrl,
          WebkitMaskImage: maskUrl,
          maskSize: `${canvasSize.w}px ${canvasSize.h}px`,
          WebkitMaskSize: `${canvasSize.w}px ${canvasSize.h}px`,
          maskPosition: "0 0",
          WebkitMaskPosition: "0 0",
        }}
      />
    </>
  );
}
