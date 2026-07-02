import { useState, useEffect, useRef } from "react";

/**
 * Extracts a still frame from a video at a given timestamp.
 * Returns a data URL string, or null while loading.
 */
export function useVideoFrame(videoSrc: string | null, seekTime = 2): string | null {
  const [frame, setFrame] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoSrc) return;

    const video = document.createElement("video");
    videoRef.current = video;
    video.crossOrigin = "anonymous";
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    let cancelled = false;

    const capture = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setFrame(canvas.toDataURL("image/jpeg", 0.8));
        }
      } catch {
        // Silently fail — caller uses fallback
      }
      video.remove();
    };

    const onLoaded = () => {
      if (cancelled) return;
      video.currentTime = Math.min(seekTime, video.duration || 2);
    };

    const onSeeked = () => {
      if (cancelled) return;
      capture();
    };

    const onError = () => {
      if (!cancelled) {
        video.remove();
        setFrame(null);
      }
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.src = videoSrc;

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      video.remove();
    };
  }, [videoSrc, seekTime]);

  return frame;
}
