// schema.org objects (JSON-LD) built from the same data the pages render, so they never drift.
import { type Product, productPath } from "./products";
import { CONTACT, LEGAL, SITE } from "./site";

const abs = (path: string) => `${SITE.url}${path}`;
const ORG_ID = `${SITE.url}/#org`;

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "NYT Studios",
        legalName: LEGAL.entity,
        url: SITE.agencyUrl,
        logo: abs("/icon.svg"),
        email: CONTACT.email,
        sameAs: [CONTACT.instagram, SITE.agencyUrl],
        address: { "@type": "PostalAddress", streetAddress: "Flat No: A-1103, Param Skywalk, Chala", addressLocality: "Vapi", postalCode: "396191", addressRegion: "Gujarat", addressCountry: "IN" },
      },
      { "@type": "WebSite", "@id": `${SITE.url}/#website`, name: SITE.name, url: SITE.url, publisher: { "@id": ORG_ID } },
    ],
  };
}

export function productGraph(p: Product) {
  const url = abs(productPath(p));
  const video = p.video
    ? {
        "@type": "VideoObject",
        "@id": `${url}#video`,
        name: `${p.name}: how it works`,
        description: p.video.caption,
        thumbnailUrl: [abs(p.video.poster)],
        uploadDate: p.video.uploadDate,
        duration: p.video.duration,
        contentUrl: abs(p.video.src),
      }
    : null;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: p.name,
        alternateName: p.altNames,
        description: p.metaDescription,
        image: [abs(p.cover.src), ...p.ads.slice(0, 4).map((a) => abs(a.img.src))],
        sku: p.slug,
        category: "Digital products > Prompt kits",
        brand: { "@type": "Brand", name: "NYT Studios" },
        audience: { "@type": "PeopleAudience", audienceType: p.audience }, // Google only accepts PeopleAudience here
        offers: {
          "@type": "Offer",
          url,
          price: p.price.amount.toFixed(2),
          priceCurrency: p.price.currency,
          availability: "https://schema.org/InStock",
          seller: { "@id": ORG_ID },
          // All sales are final (see /refunds). Countries are the main markets we advertise to.
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: ["US", "GB", "CA", "AU", "IN"],
            returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
            merchantReturnLink: abs("/refunds"),
          },
        },
        ...(video ? { subjectOf: { "@id": video["@id"] } } : {}),
      },
      ...(video ? [video] : []),
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
          { "@type": "ListItem", position: 2, name: p.name, item: url },
        ],
      },
    ],
  };
}
