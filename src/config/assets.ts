/**
 * Locale-independent brand and place assets served from `public/`. Sizes are
 * the intrinsic pixel sizes of the files; `next/image` uses them for the aspect
 * ratio and the responsive `srcset`.
 */
export const brandAssets = {
  logo: { src: "/brand/logo.svg", width: 648, height: 326 },
  icons: {
    pwa192: { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    pwa512: { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    maskable512: {
      src: "/brand/icon-512-maskable.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  },
} as const;

/** Photos of the studio itself. */
export const placePhotos = {
  studio: { src: "/images/space/studio.jpg", width: 1031, height: 1288 },
} as const;
