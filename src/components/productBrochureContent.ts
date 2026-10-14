import metadata from '@/content/productBrochureContent.json';
import type { TFunction } from 'i18next';
import type { BrochurePage } from './productBrochureLayout';

export type ContentImage = { index: number; altKey: string };
export type ContentText = {
  type: 'text';
  role:
    | 'index'
    | 'model'
    | 'title'
    | 'subtitle'
    | 'section_title'
    | 'paragraph'
    | 'caption'
    | 'eyebrow';
  key: string;
};
export type ContentMedia = {
  type: 'media' | 'logos';
  images: ContentImage[];
  captions: { key: string; line: number }[];
};
export type ContentBlock =
  | ContentText
  | ContentMedia
  | { type: 'diagram'; keys: string[]; images: ContentImage[] }
  | { type: 'features'; titleKey: string; keys: string[] }
  | { type: 'table'; columns: number; rows: (string | null)[][] }
  | {
      type: 'cards';
      kind: 'advantages' | 'scenarios' | 'partners';
      columns: number;
      items: {
        id: string;
        titleKey: string;
        descriptionKeys: string[];
        images: ContentImage[];
      }[];
    };
export type ContentPage = {
  sourcePage: number;
  id: string;
  blocks: { id: string; children: ContentBlock[] }[];
  bindings: {
    line: number;
    key: string;
    start: number;
    end: number;
    runs: [number, number][];
  }[];
};
export const brochureContent = metadata.pages as unknown as ContentPage[];

export function localizeSourcePage(
  page: BrochurePage,
  content: ContentPage,
  t: TFunction,
): BrochurePage {
  const bindings = new Map(
    content.bindings.map((binding) => [binding.line, binding]),
  );
  const imageKeys = new Map<number, string>();
  for (const section of content.blocks)
    for (const block of section.children) {
      const images =
        'images' in block
          ? block.images
          : block.type === 'cards'
            ? block.items.flatMap((item) => item.images)
            : [];
      for (const image of images) imageKeys.set(image.index, image.altKey);
    }
  return {
    ...page,
    images: page.images.map((image, index) => ({
      ...image,
      alt: imageKeys.has(index) ? t(imageKeys.get(index)!) : image.alt,
    })),
    lines: page.lines.map((line, index) => {
      const binding = bindings.get(index);
      if (!binding) return line;
      const copy = t(binding.key);
      return {
        ...line,
        text: copy.slice(binding.start, binding.end),
        runs: line.runs.map((run, i) => ({
          ...run,
          text: copy.slice(...binding.runs[i]),
        })),
      };
    }),
  } as BrochurePage;
}
