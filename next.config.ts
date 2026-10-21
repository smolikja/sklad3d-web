import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    // Enables `app/global-not-found.tsx` — the documented way to render a
    // consistent 404 when the root layout lives under a dynamic segment
    // (`app/[locale]/layout.tsx`). Lets the 404 be fully server-rendered with
    // its own localized <html lang> document.
    globalNotFound: true,
  },
  images: {
    // Member photos and posters are served from `public/`. Remote sources are
    // allowed only from the media host that keeps the large videos, so an
    // image linked from there still goes through the optimizer.
    remotePatterns: [new URL("https://smolikja.team/assets/sklad-digital/**")],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
