"use client";

// Link to Whop checkout. On click, forwards the visitor's ad tracking params
// (utm_*, fbclid) so Whop can attribute the sale to the ad that brought them.
import type { Product } from "@/lib/products";

const TRACKED = /^(utm_[a-z]+|fbclid)$/;

function withTracking(href: string): string {
  const url = new URL(href);
  new URLSearchParams(window.location.search).forEach((v, k) => {
    if (TRACKED.test(k) && !url.searchParams.has(k)) url.searchParams.set(k, v);
  });
  return url.toString();
}

export default function BuyLink({ product, label = "Get the prompts", size, id }: { product: Product; label?: string; size?: "small"; id?: string }) {
  const { amount, compareAt } = product.price;
  return (
    <a
      id={id}
      className={size === "small" ? "buy small" : "buy"}
      href={product.whopUrl}
      onClick={(e) => {
        e.currentTarget.href = withTracking(product.whopUrl);
      }}
      aria-label={`${label} for $${amount}${compareAt ? `, was $${compareAt}` : ""}. Opens Whop checkout.`}
    >
      <span className="label">{label}</span>
      <span className="price">
        ${amount}
        {compareAt && size !== "small" ? <s>${compareAt}</s> : null}
      </span>
      <i className="corner" /><i className="corner" /><i className="corner" /><i className="corner" />
    </a>
  );
}
