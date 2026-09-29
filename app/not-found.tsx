import type { Metadata } from "next";
import Link from "next/link";
import { INTERIOR_PROMPTS, productPath } from "@/lib/products";
import { Footer, Nav } from "@/components/Chrome";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Nav links={[{ href: "/", label: "Home" }]} />
      <main id="main" className="wrap lost">
        <p className="code">404, frame not found</p>
        <h1>This page isn&apos;t in the shot.</h1>
        <p className="lead">The link may be old or mistyped. Here&apos;s where most people are headed:</p>
        <div className="links">
          <Link className="textlink" href={productPath(INTERIOR_PROMPTS)}>{INTERIOR_PROMPTS.name}</Link>
          <Link className="textlink" href="/">Home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
