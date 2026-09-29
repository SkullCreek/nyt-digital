// Phase 0 placeholder. Replaced by the real home page in phase 2.
import Link from "next/link";
import { PRODUCTS, productPath } from "@/lib/products";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <main style={{ fontFamily: "var(--font-grotesk), system-ui, sans-serif", padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-syne), system-ui, sans-serif" }}>{SITE.name}</h1>
      <p>{SITE.tagline}</p>
      <ul>
        {PRODUCTS.map((p) => (
          <li key={p.slug}>
            <Link href={productPath(p)}>{p.name}</Link> - ${p.price.amount}
          </li>
        ))}
      </ul>
    </main>
  );
}
