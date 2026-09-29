// Business details used across the site, legal pages and structured data.

export const SITE = {
  name: "NYT Studios Digital",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://digital.nyt-studios.com",
  agencyUrl: "https://www.nyt-studios.com",
  tagline: "AI video tools and prompt kits from the NYT Studios ad team.",
};

// Next.js replaces (doesn't merge) a page's openGraph object, so pages spread these in.
export const OG_DEFAULTS = { siteName: SITE.name, type: "website", locale: "en_US" } as const;

export const CONTACT = {
  email: "info@nyt-studios.com",
  whatsapp: "919008474779", // country code + number, no +
  whatsappDisplay: "+91 90084 74779",
  instagram: "https://www.instagram.com/nyt.studios/",
  instagramHandle: "@nyt.studios",
};

export const LEGAL = {
  entity: "KAVITA GLOBAL INDUSTRIAL SOLUTION",
  address: "Flat No: A-1103, Param Skywalk, Chala, Vapi - 396191, Gujarat, India",
  grievanceEmail: "info@nyt-studios.com",
  jurisdiction: "Vapi, Gujarat, India",
};
