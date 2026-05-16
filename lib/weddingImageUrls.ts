/** Single source of truth for local wedding assets — used for preload + templates. */

export const TEMPLATE_THREE_HERO_IMAGES = [
  "/images/gallery/1H7A0094.JPG",
  "/images/gallery/1H7A0051.JPG",
  "/images/gallery/1H7A0460.JPG",
] as const;

export const TEMPLATE_THREE_GALLERY_SEQUENCE_IMAGES = [
  "/images/gallery/1H7A0460.JPG",
  "/images/gallery/1H7A0334.JPG",
  "/images/gallery/1H7A0094.JPG",
  "/images/gallery/1H7A0051.JPG",
] as const;

export const TEMPLATE_THREE_ARCHIVE_IMAGE = "/images/gallery/1H7A0007.JPG";

export const TEMPLATE_THREE_CRITICAL_URLS: string[] = [
  ...TEMPLATE_THREE_HERO_IMAGES,
  TEMPLATE_THREE_ARCHIVE_IMAGE,
  ...TEMPLATE_THREE_GALLERY_SEQUENCE_IMAGES,
];

const templateTwoGalleryRaw = [
  "/images/gallery/1H7A0063.JPG",
  "/images/gallery/1H7A0114.jpg",
  "/images/gallery/1H7A0199.JPG",
  "/images/gallery/1H7A0015.jpg",
  "/images/gallery/1H7A0238.JPG",
  "/images/gallery/1H7A0051.JPG",
  "/images/gallery/1H7A0007.JPG",
  "/images/gallery/1H7A0460.jpg",
  "/images/gallery/1H7A0334.jpg",
  "/images/gallery/1H7A0094.JPG",
];

export const TEMPLATE_TWO_HERO_IMAGE = "/images/gallery/1H7A0460.JPG";

/** Deduped gallery URLs for preload + strip. */
export const TEMPLATE_TWO_GALLERY_IMAGES: string[] = Array.from(new Set(templateTwoGalleryRaw));

export const TEMPLATE_TWO_CRITICAL_URLS: string[] = [
  TEMPLATE_TWO_HERO_IMAGE,
  ...TEMPLATE_TWO_GALLERY_IMAGES,
];

export type HomeTemplateId = "elegant" | "modern";

export function getCriticalUrlsForTemplate(id: HomeTemplateId): string[] {
  return id === "elegant" ? [...TEMPLATE_THREE_CRITICAL_URLS] : [...TEMPLATE_TWO_CRITICAL_URLS];
}
