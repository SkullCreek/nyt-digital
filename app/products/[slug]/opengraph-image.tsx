import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/products";
import { OG_SIZE, renderCard } from "@/lib/og";

export const alt = "Product preview";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) notFound();
  return renderCard({
    kicker: p.altNames[0],
    title: p.name,
    price: { amount: p.price.amount, compareAt: p.price.compareAt },
    image: p.cover.src,
  });
}
