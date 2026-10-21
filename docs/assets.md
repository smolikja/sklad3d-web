# Web assets

Images are committed to the repository and served by the site itself; videos
stay on the media host and are referenced by URL. This page explains where
each kind of file goes, how to prepare it and why the split looks like this.

## Where files live

| Asset | Location | Registered in |
| --- | --- | --- |
| Member portrait | `public/images/members/<id>/avatar.jpg` | `src/config/members.ts` (`avatar(...)`) |
| Member still (render, photo, screenshot) | `public/images/members/<id>/work/<slug>.jpg` | `src/config/members.ts` (`image(...)`) |
| Video poster (one frame of the video) | `public/images/members/<id>/posters/<media-id>.jpg` | `src/config/members.ts` (`video(...)`) |
| Video | media host, `https://smolikja.team/assets/sklad-digital/members/<id>/showcase/<file>.mp4` | `src/config/members.ts` (`video(...)`) |
| Studio photo (hero, share image, structured data) | `public/images/space/studio.jpg` | `src/config/assets.ts` |
| Logo | `public/brand/logo.svg`, inlined as `src/components/icons/sklad-logo.tsx` | `src/config/assets.ts` |
| PWA icons | `public/brand/icon-192.png`, `icon-512.png`, `icon-512-maskable.png` | `src/config/assets.ts` |
| Favicons | `src/app/favicon.ico`, `icon.png`, `apple-icon.png` | Next.js file conventions |
| Share-image fonts | `src/lib/og/archivo-*.woff` | `src/lib/og/og-image.tsx` |

Every image is registered with its intrinsic pixel size. `next/image` uses it
for the aspect ratio (no layout shift) and the responsive `srcset`; the gallery
uses it to size each slide so nothing is cropped.

## Why images are in the repository

- **They do not load the server.** `next/image` serves each photo as AVIF or
  WebP at the width the slot actually needs. A variant is encoded once and then
  cached (`.next/cache/images`, plus Cloudflare in front of the site), so the
  2560 px source is never sent to a phone. Files under `public/` are plain
  static files; no page code runs for them.
- **They help search.** Photos on the site's own domain are attributed to
  `sklad.digital` in image search and are listed in `sitemap.xml` next to the
  page.
- **Videos are the exception.** They are tens of megabytes, are streamed with
  range requests and change independently of the site, so they would only
  bloat the repository and slow every deployment.

## Preparing an image

- Photos and renders as JPEG; PNG only when transparency matters; WebP is
  accepted too.
- At most 2560 px on the long side, quality around 85, metadata (EXIF, GPS)
  removed.
- Lowercase, hyphenated file names (`breathing-forest.jpg`).
- Portraits square and at least 480 × 480 px — they are shown at up to
  160 CSS px, i.e. 320 px on high-density screens.

```bash
# Resize, strip metadata and re-encode
ffmpeg -i input.jpg -map_metadata -1 \
  -vf "scale='min(2560,iw)':'min(2560,ih)':force_original_aspect_ratio=decrease:flags=lanczos" \
  -q:v 3 public/images/members/<id>/work/<slug>.jpg

# Read the size to register in src/config/members.ts
sips -g pixelWidth -g pixelHeight public/images/members/<id>/work/<slug>.jpg
```

When an image changes, give it a new file name instead of overwriting it:
optimized variants and browser caches are keyed by URL.

## Adding a video

1. Encode an MP4 (H.264 + AAC) with the index at the start of the file so the
   preview starts before the download finishes. Inline previews do not need
   more than 1080p; aim for roughly 10 MB or less.

   ```bash
   ffmpeg -i master.mov -c:v libx264 -crf 23 -preset slow -vf "scale='min(1920,iw)':-2" \
     -c:a aac -b:a 128k -movflags +faststart <file>.mp4
   ```

2. Upload it to the media host under the member's `showcase/` folder.
3. Export a poster frame into the repository; its size is the video's size:

   ```bash
   ffmpeg -ss 1 -i <file>.mp4 -frames:v 1 -q:v 3 public/images/members/<id>/posters/<media-id>.jpg
   ```

4. Add `video("<id>", "<media-id>", "<id>/showcase/<file>.mp4", width, height)`
   to the member's `media` in `src/config/members.ts`.

Inline previews are muted, load nothing until they scroll into view, play only
while visible and do not autoplay for visitors who prefer reduced motion or
save data. The lightbox plays the same file with sound and controls.

## Adding or changing a member

1. Create `public/images/members/<id>/` with `avatar.jpg` and, if there is
   work to show, `work/` and `posters/`.
2. Add the member to `src/config/members.ts` in the position they should
   appear: name, optional nickname, avatar size, links and media.
3. Add `members.items.<id>` to every catalog in `messages/`: `role`, `bio`
   paragraphs, one label per link id and one description per media id — see
   [Localization](localization.md).
4. Run `pnpm check && pnpm build`. The loader refuses to build when a
   configured link or media item has no copy.

## Icons

The favicon and app icons are the logo on black, generated from a 1080 × 1080
render of the mark (`logo_black_bg.png` in the repository history) with
ffmpeg: a tight 820 px crop for `icon.png`, `icon-192.png` and `icon-512.png`,
900 px for `apple-icon.png`, the full frame for the maskable icon (the mark
stays inside the safe zone) and a 48 px PNG wrapped as `favicon.ico`.
Regenerate all of them together if the mark changes.
