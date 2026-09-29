"use client";

// The UGC ad inside camera viewfinder brackets with a live timecode.
// Autoplays muted unless the visitor prefers reduced motion; always pausable.
// Captions are burned into the video; the VTT track is there for assistive tech and search.
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { Pause, Play, SoundOff, SoundOn } from "./icons";

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
const timecode = (t: number) => `00:${pad(t / 60)}:${pad(t % 60)}:${pad((t % 1) * 25)}`;

export default function Viewfinder({ video }: { video: NonNullable<Product["video"]> }) {
  const ref = useRef<HTMLVideoElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) v.play().catch(() => {});
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <figure className={`finder${playing ? "" : " paused"}`}>
      <div className="box">
      <div className="frame" style={{ ["--ar" as string]: `${video.width} / ${video.height}` }}>
        <video
          ref={ref}
          src={video.src}
          poster={video.poster}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          width={video.width}
          height={video.height}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => {
            if (tcRef.current) tcRef.current.textContent = timecode(e.currentTarget.currentTime);
          }}
          aria-label="Ad for the prompt kit"
        >
          <track kind="captions" src={video.captions} srcLang="en" label="English" />
        </video>
        <div className="hud" aria-hidden="true">
          <span className="rec"><i />REC</span>
          <span ref={tcRef}>00:00:00:00</span>
        </div>
        <div className="controls">
          <button type="button" className="ctl" onClick={toggle} aria-label={playing ? "Pause video" : "Play video"}>
            {playing ? <Pause /> : <Play />}
          </button>
          <button type="button" className="ctl" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={!muted}>
            {muted ? <SoundOff /> : <SoundOn />}
          </button>
        </div>
      </div>
      <i className="corner" /><i className="corner" /><i className="corner" /><i className="corner" />
      </div>
      <figcaption>{video.caption}</figcaption>
    </figure>
  );
}
