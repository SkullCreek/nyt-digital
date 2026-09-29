"use client";

// The sample prompt's output clip. Loads nothing until it scrolls into view, then plays
// muted on loop (unless reduced motion is preferred). Pausable, with an optional sound toggle.
import { useEffect, useRef, useState } from "react";
import { Pause, Play, SoundOff, SoundOn } from "./icons";

export default function SampleClip({ src, poster, width, height, label }: { src: string; poster: string; width: number; height: number; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.5 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div className="clip">
      <video
        ref={ref}
        src={src}
        poster={poster}
        width={width}
        height={height}
        muted={muted}
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label={label}
      />
      <div className="controls">
        <button type="button" className="ctl" onClick={toggle} aria-label={playing ? "Pause clip" : "Play clip"}>
          {playing ? <Pause /> : <Play />}
        </button>
        <button type="button" className="ctl" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={!muted}>
          {muted ? <SoundOff /> : <SoundOn />}
        </button>
      </div>
    </div>
  );
}
