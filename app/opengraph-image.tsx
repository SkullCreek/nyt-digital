import { OG_SIZE, renderCard } from "@/lib/og";

export const alt = "NYT Studios Digital: AI video prompt kits from an AI ad studio";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderCard({
    kicker: "From the NYT Studios ad team",
    title: "Make the AI ads yourself.",
    image: "/images/kit-cover.jpg",
  });
}
