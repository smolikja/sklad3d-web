import { siteConfig } from "@/config/site";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/og-image";

const domain = siteConfig.url.replace("https://", "");

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(isLocale(locale) ? locale : defaultLocale);
  return [{ id: "og", alt: dict.og.alt, size: OG_SIZE, contentType: OG_CONTENT_TYPE }];
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(isLocale(locale) ? locale : defaultLocale);

  return renderOgImage({
    title: dict.og.title,
    address: dict.place.address,
    domain,
  });
}
