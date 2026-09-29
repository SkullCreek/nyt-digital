// Social preview cards (1200x630), rendered at build time with next/og.
// Same brand as the site: plaster ground, navy Syne type, cobalt price, viewfinder corners.
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

// Paths are scoped to fixed folders so the build only bundles these files, not the whole project.
const font = (name: string) => readFile(join(process.cwd(), "assets", "og", name));

async function imageDataUrl(publicPath: string, mime: string) {
  const name = publicPath.replace(/^\/images\//, "");
  if (name.includes("/") || name.includes("..")) throw new Error(`OG images must live in /public/images: ${publicPath}`);
  return `data:${mime};base64,${(await readFile(join(process.cwd(), "public", "images", name))).toString("base64")}`;
}

type Card = { kicker: string; title: string; price?: { amount: number; compareAt?: number }; image: string; imageMime?: string };

const Corner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const b = "5px solid #0F1A3C";
  const style: Record<string, string | number> = { position: "absolute", width: 44, height: 44 };
  if (pos[0] === "t") { style.top = 0; style.borderTop = b; } else { style.bottom = 0; style.borderBottom = b; }
  if (pos[1] === "l") { style.left = 0; style.borderLeft = b; } else { style.right = 0; style.borderRight = b; }
  return <div style={style} />;
};

export async function renderCard({ kicker, title, price, image, imageMime = "image/jpeg" }: Card) {
  const [syne, grotesk, img] = await Promise.all([
    font("syne-latin-800-normal.woff"),
    font("space-grotesk-latin-500-normal.woff"),
    imageDataUrl(image, imageMime),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#EEF0F3", color: "#0F1A3C", fontFamily: "Grotesk" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 40px 56px 64px", width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="44" height="44" viewBox="-100 -100 200 200">
              <rect x="-96" y="-96" width="192" height="192" rx="46" fill="#FFFFFF" stroke="#0F1A3C" strokeWidth="8" />
              <path d="M0 -70 C0 -22 17 0 58 0 C17 0 0 22 0 70 C0 22 -17 0 -58 0 C-17 0 0 -22 0 -70Z" fill="#2346D0" />
            </svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "Syne", fontSize: 26, letterSpacing: 1 }}>NYT</div>
              <div style={{ fontSize: 11, letterSpacing: 5, color: "#4A5270" }}>DIGITAL</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 26, color: "#4A5270" }}>{kicker}</div>
            <div style={{ fontFamily: "Syne", fontSize: title.length > 40 ? 54 : 68, lineHeight: 1.02, letterSpacing: -1.5 }}>{title}</div>
          </div>
          {price ? (
            <div style={{ display: "flex", alignItems: "center", alignSelf: "flex-start", background: "#2346D0", color: "#FFFFFF", borderRadius: 99, padding: "16px 30px", gap: 14 }}>
              <div style={{ fontSize: 26 }}>Instant download</div>
              {/* Grotesk, not Syne: Syne's default 9 drops below the baseline and next/og can't switch to lining figures. */}
              <div style={{ fontSize: 34 }}>{`$${price.amount}`}</div>
              {price.compareAt ? <div style={{ fontSize: 22, opacity: 0.7, textDecoration: "line-through" }}>{`$${price.compareAt}`}</div> : null}
            </div>
          ) : (
            <div style={{ fontSize: 24, color: "#4A5270" }}>digital.nyt-studios.com</div>
          )}
        </div>
        <div style={{ display: "flex", position: "relative", width: 560, height: 630, padding: 40 }}>
          <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", padding: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" width={444} height={514} style={{ width: 444, height: 514, objectFit: "cover", borderRadius: 18 }} />
            <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Syne", data: syne, weight: 800, style: "normal" },
        { name: "Grotesk", data: grotesk, weight: 500, style: "normal" },
      ],
    },
  );
}
