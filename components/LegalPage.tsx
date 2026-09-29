import type React from "react";
import { Footer, Nav } from "./Chrome";

export const LEGAL_UPDATED = "29 September 2026";

const NAV = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refunds", label: "Refunds" },
];

export default function LegalPage({ title, summary, children }: { title: string; summary: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      <Nav links={NAV} />
      <main id="main" className="wrap legal-page">
        <article className="prose">
          <h1>{title}</h1>
          <p className="updated">Last updated {LEGAL_UPDATED}</p>
          <div className="summary">{summary}</div>
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
