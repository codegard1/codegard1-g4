import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "minimal-ui",
    background_color: site.themeColor,
    theme_color: site.themeColor,
    icons: [
      { src: "/images/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/images/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
