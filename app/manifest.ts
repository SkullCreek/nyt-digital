import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "NYT Digital",
    description: SITE.tagline,
    start_url: "/",
    display: "browser",
    background_color: "#EEF0F3",
    theme_color: "#EEF0F3",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
