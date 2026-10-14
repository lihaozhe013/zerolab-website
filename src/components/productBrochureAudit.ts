import { auditResponsiveBrochure } from './productBrochureResponsiveAudit';

type AlignmentIssue = { page: string; kind: string; detail: string };

export function auditProductBrochure() {
  const root = document.querySelector<HTMLElement>('.product-brochure');
  if (!root) throw new Error('Open the product page before running this audit');
  if (root.dataset.renderer === 'responsive')
    return auditResponsiveBrochure(root);
  const mobile = window.matchMedia('(max-width: 768px)').matches;
  const issues: AlignmentIssue[] = [];
  let lineCount = 0;
  let textRunCount = 0;
  let maxBaselineError = 0;
  let maxWidthError = 0;
  const sameItems = (a: string[], b: string[]) =>
    JSON.stringify(a.sort()) === JSON.stringify(b.sort());

  for (const page of root.querySelectorAll<HTMLElement>('.brochure-page')) {
    const report = (kind: string, detail: string) =>
      issues.push({ page: page.id, kind, detail });
    const desktopLines = Array.from(
      page.querySelectorAll<HTMLElement>('.brochure-page__positioned-line'),
    );
    lineCount += desktopLines.length;
    const geometryNodes = Array.from(
      page.querySelectorAll<HTMLElement>(
        '.brochure-page__positioned-line:not(.has-runs), .brochure-page__run',
      ),
    );
    textRunCount += geometryNodes.length;
    const mobileLines = Array.from(
      page.querySelectorAll<HTMLElement>('[data-brochure-copy]'),
    );
    if (
      !sameItems(
        desktopLines.map((line) => line.textContent || ''),
        mobileLines.map((line) => line.textContent || ''),
      )
    )
      report('copy', 'Desktop and mobile copy differ');
    const imageSources = (selector: string) =>
      Array.from(page.querySelectorAll<HTMLImageElement>(selector)).map(
        (image) => image.getAttribute('src') || '',
      );
    if (
      !sameItems(
        imageSources('.brochure-page__positioned-image'),
        imageSources('.brochure-page__mobile-image'),
      )
    )
      report('images', 'Desktop and mobile image sets differ');

    if (!mobile) {
      for (const line of geometryNodes) {
        const text = line.querySelector<HTMLElement>('.brochure-page__text')!;
        const marker = line.querySelector<HTMLElement>(
          '.brochure-page__baseline',
        )!;
        const expected = line.getBoundingClientRect();
        const actual = text.getBoundingClientRect();
        const baselineError = Math.abs(
          marker.getBoundingClientRect().top - expected.top,
        );
        const widthError = Math.abs(actual.width - expected.width);
        maxBaselineError = Math.max(maxBaselineError, baselineError);
        maxWidthError = Math.max(maxWidthError, widthError);
        if (
          baselineError > 0.5 ||
          widthError > 0.5 ||
          Math.abs(actual.left - expected.left) > 0.5
        )
          report('text-alignment', line.textContent || '');
      }
    } else {
      for (const parent of page.querySelectorAll<HTMLElement>(
        '.brochure-page__mobile-flow, .brochure-page__mobile-section, .brochure-page__mobile-card, .brochure-page__mobile-figure',
      )) {
        const children = Array.from(parent.children).filter(
          (child) => child.getBoundingClientRect().height > 0,
        );
        for (let i = 1; i < children.length; i++) {
          if (
            children[i].getBoundingClientRect().top <
            children[i - 1].getBoundingClientRect().bottom - 0.5
          )
            report('overlap', parent.className);
        }
      }
      for (const text of page.querySelectorAll<HTMLElement>(
        '.brochure-page__mobile-line, h3, th, td',
      )) {
        if (Number.parseFloat(getComputedStyle(text).fontSize) < 16)
          report('text-size', text.textContent || '');
      }
      for (const row of page.querySelectorAll<HTMLTableRowElement>('tr')) {
        const cells = Array.from(row.cells).map((cell) =>
          cell.getBoundingClientRect(),
        );
        if (
          cells.some(
            (cell) =>
              Math.abs(cell.top - cells[0].top) > 0.5 ||
              Math.abs(cell.bottom - cells[0].bottom) > 0.5,
          )
        )
          report('table-row', row.textContent || '');
      }
      for (const table of page.querySelectorAll<HTMLElement>(
        '.brochure-page__mobile-table:not(.is-comparison)',
      )) {
        if (
          table.getBoundingClientRect().width >
          table.parentElement!.getBoundingClientRect().width + 0.5
        )
          report(
            'table-overflow',
            'A two-column table exceeds its scroll container',
          );
      }
    }

    const visibleImages = page.querySelectorAll<HTMLImageElement>(
      mobile
        ? '.brochure-page__mobile-image'
        : '.brochure-page__positioned-image',
    );
    for (const image of visibleImages) {
      if (!image.complete || !image.naturalWidth)
        report('image-loading', image.getAttribute('src') || '');
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
    pageCount: root.querySelectorAll('.brochure-page').length,
    lineCount,
    textRunCount,
    maxBaselineError,
    maxWidthError,
    issues,
  };
}
