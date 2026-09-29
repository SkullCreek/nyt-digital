"use client";

import { useRef, useState } from "react";
import { Check, CopyIcon } from "./icons";

export default function CopyPrompt({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setDone(false), 2000);
    } catch {
      // Clipboard blocked: leave the text selectable as the fallback.
    }
  };

  return (
    <button type="button" className="copy" onClick={copy} data-done={done}>
      <span className="t" aria-live="polite">{done ? "Copied" : "Copy"}</span>
      <span className="i">{done ? <Check /> : <CopyIcon />}</span>
    </button>
  );
}
