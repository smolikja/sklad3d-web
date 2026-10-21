import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Page palette (see globals.css) as hex, because Satori has no CSS variables.
const BACKGROUND = "#000000";
const FOREGROUND = "#EEF2F0";
const MUTED = "#A9B1AE";
const PRIMARY = "#7CFFDF";
const SUBPIXELS = ["#ff0000", "#00ff00", "#0c00ff"] as const;

// Static assets are read once at module load (hoisted I/O): the studio photo as
// a data URL for Satori's <img>, and two static Archivo instances. The fonts
// are bundled because Satori's built-in font has no Czech glyphs and cannot
// read variable fonts. Paths stay literal so the build traces only these files.
function readAsset(read: () => Buffer): Buffer | null {
  try {
    return read();
  } catch {
    return null;
  }
}

const studioPhoto = readAsset(() => readFileSync(join(process.cwd(), "public/images/space/studio.jpg")));
const studioDataUrl = studioPhoto ? `data:image/jpeg;base64,${studioPhoto.toString("base64")}` : "";
const displayFont = readAsset(() => readFileSync(join(process.cwd(), "src/lib/og/archivo-expanded-800.woff")));
const textFont = readAsset(() => readFileSync(join(process.cwd(), "src/lib/og/archivo-500.woff")));

/**
 * Renders the share card: the RGB mark and name, the headline and the
 * address on black, with the studio photo filling the right third.
 */
export function renderOgImage({
  title,
  address,
  domain,
}: {
  title: string;
  address: string;
  domain: string;
}) {
  const fonts = [
    displayFont && { name: "Archivo Expanded", data: displayFont, weight: 800 as const, style: "normal" as const },
    textFont && { name: "Archivo", data: textFont, weight: 500 as const, style: "normal" as const },
  ].filter((font) => font !== null);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: BACKGROUND }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 64,
            color: FOREGROUND,
            fontFamily: "Archivo",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", gap: 5 }}>
              {SUBPIXELS.map((color) => (
                <div key={color} style={{ width: 19, height: 32, borderRadius: 2, background: color }} />
              ))}
            </div>
            <div style={{ fontFamily: "Archivo Expanded", fontSize: 40, letterSpacing: -1 }}>SKLAD</div>
          </div>
          <div style={{ fontFamily: "Archivo Expanded", fontSize: 54, lineHeight: 1.04, letterSpacing: -1.5 }}>
            {title}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 }}>
            <span style={{ color: MUTED }}>{address}</span>
            <span style={{ color: PRIMARY }}>{domain}</span>
          </div>
        </div>
        {studioDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={studioDataUrl} alt="" width={380} height={630} style={{ objectFit: "cover" }} />
        ) : null}
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
