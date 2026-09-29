"use client";

// Mobile-only buy bar. Shows once the hero buy button has scrolled out of view.
import { useEffect, useState } from "react";
import type { BuyInfo } from "@/lib/products";
import BuyLink from "./BuyLink";

export default function StickyBuy({ product, watchId }: { product: BuyInfo; watchId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(target);
    return () => io.disconnect();
  }, [watchId]);

  return (
    <div className="stickybuy" data-show={show} inert={!show}>
      <p>{product.shortName}</p>
      <BuyLink product={product} size="small" />
    </div>
  );
}
