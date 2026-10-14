import data from '@/content/productBrochureData.json';

export type BrochurePage = (typeof data.pages)[number];
export type BrochureLine = BrochurePage['lines'][number];
export type BrochureImage = BrochurePage['images'][number];
export type BrochureDecoration = BrochurePage['decorations'][number];

export function isContentLine(line: BrochureLine) {
  return !(line.y < 55 || (line.y > 790 && /^\d{2}$/.test(line.text)));
}

export function isContentImage(image: BrochureImage) {
  return !/\/(?:brand-(symbol|wordmark)\.png|openarm-zm-page-edge\.webp)$/.test(
    image.src,
  );
}

export function isSectionHeading(line: BrochureLine) {
  return line.x > 50 && line.x < 65 && line.size >= 14 && line.size <= 18;
}

export function getFontFamily(font: string) {
  if (font.includes('ArialNarrow'))
    return 'Brochure Arial Narrow, Arial, sans-serif';
  if (font.includes('ArialMT')) return 'Brochure Arial, Arial, sans-serif';
  return 'Noto Sans SC, sans-serif';
}

export function needsLightLogoBacking(src: string) {
  return /\/(engineai|partner-asd|partner-engineai|partner-fourier|partner-matrix|partner-pndbotics|partner-unitree|partner-zhejiang-humanoid-center|ros|unity|unreal-engine)\.png$/.test(
    src,
  );
}

export function getPageTable(page: BrochurePage) {
  const rows = new Map<number, Array<{ left: number; right: number }>>();
  for (const rule of page.decorations) {
    if (
      rule.type !== 'line' ||
      rule.x1 === undefined ||
      rule.x2 === undefined ||
      rule.y1 === undefined ||
      rule.y2 === undefined ||
      Math.abs(rule.y1 - rule.y2) > 0.1 ||
      rule.x2 - rule.x1 < 80 ||
      rule.y1 < 55 ||
      rule.y1 > 800
    )
      continue;
    const y = Math.round(rule.y1 * 100) / 100;
    rows.set(y, [...(rows.get(y) || []), { left: rule.x1, right: rule.x2 }]);
  }
  const boundaries = Array.from(rows.entries())
    .filter(
      ([, segments]) =>
        segments.length >= 2 &&
        segments.reduce((sum, s) => sum + s.right - s.left, 0) > 500,
    )
    .sort(([a], [b]) => a - b);
  if (boundaries.length < 5) return null;
  const rowHeight = boundaries[1][0] - boundaries[0][0];
  const segments = boundaries[0][1].sort((a, b) => a.left - b.left);
  const columns = [segments[0].left, ...segments.map((s) => s.right)];
  const top = boundaries[0][0] - rowHeight * 2;
  const edges = [top, top + rowHeight, ...boundaries.map(([y]) => y)];
  const lineIndices = new Set<number>();
  const cells = edges.slice(0, -1).map((y, row) =>
    columns.slice(0, -1).map((x, col) =>
      page.lines
        .filter((line, index) => {
          const center = line.x + line.w / 2;
          const included =
            line.baseline >= y &&
            line.baseline < edges[row + 1] &&
            center >= x &&
            center < columns[col + 1];
          if (included) lineIndices.add(index);
          return included;
        })
        .sort((a, b) => a.baseline - b.baseline || a.x - b.x),
    ),
  );
  return { top, rowHeight, columns, edges, cells, lineIndices };
}

export function getMobileSections(page: BrochurePage) {
  const table = getPageTable(page);
  const lines = page.lines.filter(
    (line, index) => isContentLine(line) && !table?.lineIndices.has(index),
  );
  const images = page.images.filter(isContentImage);
  const headings = lines.filter(isSectionHeading);
  const starts = [
    Number.NEGATIVE_INFINITY,
    ...headings.map((line) => line.baseline - 3),
  ];
  return starts.map((start, index) => {
    const end = starts[index + 1] ?? Number.POSITIVE_INFINITY;
    const sectionLines = lines.filter(
      (line) => line.baseline >= start && line.baseline < end,
    );
    const title = sectionLines.filter(
      (line) =>
        headings[index - 1] &&
        Math.abs(line.baseline - headings[index - 1].baseline) < 3,
    );
    const body = sectionLines.filter((line) => !title.includes(line));
    const sectionImages = images.filter(
      (image) => image.y >= start && image.y < end,
    );
    const anchors = body.filter(
      (line) => line.bold && line.size >= 13 && line.size < 18,
    );
    const cards = anchors.map((anchor) => ({
      anchor,
      lines: [] as BrochureLine[],
      images: [] as BrochureImage[],
    }));
    const looseLines: BrochureLine[] = [];
    for (const line of body) {
      if (anchors.includes(line)) continue;
      const candidates = cards.filter(
        (card) => card.anchor.baseline <= line.baseline + 1,
      );
      const card = candidates.sort(
        (a, b) =>
          line.baseline -
          a.anchor.baseline +
          Math.abs(line.x - a.anchor.x) * 0.5 -
          (line.baseline -
            b.anchor.baseline +
            Math.abs(line.x - b.anchor.x) * 0.5),
      )[0];
      if (card) card.lines.push(line);
      else looseLines.push(line);
    }
    const looseImages: BrochureImage[] = [];
    for (const image of sectionImages) {
      const card = [...cards].sort(
        (a, b) =>
          Math.abs(image.y - a.anchor.baseline) +
          Math.abs(image.x - a.anchor.x) * 0.35 -
          (Math.abs(image.y - b.anchor.baseline) +
            Math.abs(image.x - b.anchor.x) * 0.35),
      )[0];
      if (card) card.images.push(image);
      else looseImages.push(image);
    }
    return {
      title,
      cards,
      lines: looseLines,
      images: looseImages,
      table: table && table.top >= start && table.top < end ? table : null,
    };
  });
}
