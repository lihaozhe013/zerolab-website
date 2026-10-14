import data from '@/content/productBrochureData.json';
import i18n from '@/i18n';
import { brochureContent } from './productBrochureContent';
import { isContentImage } from './productBrochureLayout';

type Issue = { page: string; kind: string; detail: string };

export function auditResponsiveBrochure(root: HTMLElement) {
  const issues: Issue[] = [];
  let copyCount = 0;
  for (const [index, content] of brochureContent.entries()) {
    const page = document.getElementById(content.id);
    if (!page) {
      issues.push({
        page: content.id,
        kind: 'page',
        detail: 'Section is missing',
      });
      continue;
    }
    const report = (kind: string, detail: string) =>
      issues.push({ page: content.id, kind, detail });
    const expected = new Set(
      content.bindings
        .map((binding) => binding.key)
        .filter((key) => i18n.t(key)),
    );
    const copies = Array.from(
      page.querySelectorAll<HTMLElement>('[data-copy-key]'),
    );
    copyCount += copies.length;
    for (const key of expected) {
      const matches = copies.filter((node) => node.dataset.copyKey === key);
      if (matches.length !== 1 || matches[0].textContent !== i18n.t(key))
        report('copy', key);
    }
    for (const node of copies) {
      if (!expected.has(node.dataset.copyKey!))
        report('unexpected-copy', node.dataset.copyKey!);
      if (/[\u3400-\u9fff]/u.test(node.textContent || ''))
        report('untranslated-copy', node.dataset.copyKey!);
      const style = getComputedStyle(node);
      if (Number.parseFloat(style.fontSize) < 16)
        report('text-size', node.dataset.copyKey!);
      if (node.clientWidth > 0 && node.scrollWidth > node.clientWidth + 1)
        report('text-overflow', node.dataset.copyKey!);
    }
    const images = Array.from(page.querySelectorAll<HTMLImageElement>('img'));
    const expectedImages = data.pages[index].images
      .filter(isContentImage)
      .map((image) => image.src)
      .sort();
    if (
      JSON.stringify(
        images.map((image) => image.getAttribute('src')).sort(),
      ) !== JSON.stringify(expectedImages)
    )
      report('images', 'Image coverage differs from the source');
    for (const image of images)
      if (!image.complete || !image.naturalWidth)
        report('image-loading', image.src);
    for (const section of page.querySelectorAll<HTMLElement>(
      '.english-brochure, .english-brochure__section, .english-brochure__card-copy',
    )) {
      const children = Array.from(section.children)
        .map((child) => child.getBoundingClientRect())
        .filter((rect) => rect.height > 0);
      for (let i = 1; i < children.length; i++)
        if (children[i].top < children[i - 1].bottom - 1)
          report('overlap', section.className);
    }
    for (const grid of page.querySelectorAll<HTMLElement>(
      '.english-brochure__grid',
    )) {
      const columns =
        getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      const cards = Array.from(grid.children).map((card) =>
        card.getBoundingClientRect(),
      );
      for (let i = 0; i < cards.length; i++) {
        const rowStart = Math.floor(i / columns) * columns;
        if (Math.abs(cards[i].top - cards[rowStart].top) > 1)
          report('grid-row', grid.className);
        if (
          i >= columns &&
          Math.abs(cards[i].left - cards[i - columns].left) > 1 &&
          !(grid.classList.contains('is-partners') && i === cards.length - 1)
        )
          report('grid-column', grid.className);
      }
    }
    for (const row of page.querySelectorAll<HTMLTableRowElement>('tr')) {
      const cells = Array.from(row.cells).map((cell) =>
        cell.getBoundingClientRect(),
      );
      if (
        cells.some(
          (cell) =>
            Math.abs(cell.top - cells[0].top) > 1 ||
            Math.abs(cell.bottom - cells[0].bottom) > 1,
        )
      )
        report('table-row', row.textContent || '');
    }
  }
  if (document.documentElement.scrollWidth > window.innerWidth)
    issues.push({
      page: 'document',
      kind: 'overflow',
      detail: 'The page has horizontal overflow',
    });
  return {
    viewport: { width: window.innerWidth, height: window.innerHeight },
    theme: document.documentElement.dataset.theme,
    language: root.lang,
    renderer: 'responsive',
    pageCount: root.querySelectorAll('.brochure-page').length,
    copyCount,
    issues,
  };
}
