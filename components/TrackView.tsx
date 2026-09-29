"use client";

// Sends Meta's ViewContent once per product page view.
import { useEffect } from "react";
import { trackViewContent } from "@/lib/track";

export default function TrackView({ id, name, value, currency }: { id: string; name: string; value: number; currency: string }) {
  useEffect(() => {
    trackViewContent(id, name, { value, currency });
  }, [id, name, value, currency]);
  return null;
}
