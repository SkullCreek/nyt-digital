// /llms.txt: a plain-text summary for AI assistants and answer engines (llmstxt.org).
import { PRODUCTS, productPath } from "@/lib/products";
import { CONTACT, LEGAL, SITE } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.name} sells AI video prompt kits made by NYT Studios, an AI video ad studio. Products are instant digital downloads sold through Whop.`,
    "",
    "## Products",
    "",
    ...PRODUCTS.flatMap((p) => [
      `- [${p.name}](${SITE.url}${productPath(p)}): ${p.tagline} Also known as ${p.altNames.join(" and ")}. For ${p.audience.toLowerCase()}. Price: $${p.price.amount} (USD), instant download.`,
      ...p.includes.map((b) => `  - ${b.title} (${b.meta}): ${b.items.join("; ")}.`),
      `  - Works with: ${p.tools.map((t) => `${t.name} (${t.role.toLowerCase()})`).join(", ")}. AI tools are not included.`,
      `  - Refunds: all sales are final; files that don't arrive or won't open are replaced.`,
    ]),
    "",
    "## Frequently asked",
    "",
    ...PRODUCTS.flatMap((p) => p.faq.map((f) => `- ${f.q} ${f.a}`)),
    "",
    "## Company",
    "",
    `- Seller: ${LEGAL.entity}, ${LEGAL.address}`,
    `- Contact: ${CONTACT.email}, Instagram ${CONTACT.instagramHandle}`,
    `- AI ad studio (done-for-you ads): ${SITE.agencyUrl}`,
    `- Policies: ${SITE.url}/privacy, ${SITE.url}/terms, ${SITE.url}/refunds`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
