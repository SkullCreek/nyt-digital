// Small inline icon set. Decorative by default (aria-hidden).
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const Spark = (p: P) => (
  <svg viewBox="-10 -10 20 20" aria-hidden="true" {...p}>
    <path d="M0 -10 C0 -3 2.4 0 8 0 C2.4 0 0 3 0 10 C0 3 -2.4 0 -8 0 C-2.4 0 0 -3 0 -10Z" fill="currentColor" />
  </svg>
);
export const Check = (p: P) => (<svg {...base} {...p}><path d="M20 6 9 17l-5-5" /></svg>);
export const Cross = (p: P) => (<svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>);
export const CopyIcon = (p: P) => (<svg {...base} {...p}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></svg>);
export const Play = (p: P) => (<svg {...base} {...p}><path d="M7 4v16l13-8z" fill="currentColor" stroke="none" /></svg>);
export const Pause = (p: P) => (<svg {...base} {...p}><path d="M8 5v14M16 5v14" strokeWidth={3} /></svg>);
export const SoundOff = (p: P) => (<svg {...base} {...p}><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" /><path d="m22 9-6 6M16 9l6 6" /></svg>);
export const SoundOn = (p: P) => (<svg {...base} {...p}><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></svg>);
