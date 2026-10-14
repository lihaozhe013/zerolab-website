import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import data from '@/content/productBrochureData.json';
import './product-brochure.css';

type BrochureLine = (typeof data.pages)[number]['lines'][number];
type BrochureImage = (typeof data.pages)[number]['images'][number];
type BrochureDecoration = (typeof data.pages)[number]['decorations'][number];

const fontFaces = {
  'arial-regular': 'Brochure Arial',
  'arial-narrow-bold': 'Brochure Arial Narrow',
} as const;

const lightBackedLogoFiles = new Set([
  'engineai.png',
  'partner-asd.png',
  'partner-engineai.png',
  'partner-fourier.png',
  'partner-matrix.png',
  'partner-pndbotics.png',
  'partner-unitree.png',
  'partner-zhejiang-humanoid-center.png',
  'ros.png',
  'unity.png',
  'unreal-engine.png',
]);

function needsLightLogoBacking(src: string) {
  return lightBackedLogoFiles.has(src.split('/').at(-1) ?? '');
}

function getFontFamily(font: string) {
  if (font.includes('ArialNarrow'))
    return 'Brochure Arial Narrow, Arial, sans-serif';
  if (font.includes('ArialMT')) return 'Brochure Arial, Arial, sans-serif';
  return 'Noto Sans SC, sans-serif';
}

function percent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

function isContentLine(line: BrochureLine) {
  return !(line.y < 55 || (line.y > 790 && /^\d{2}$/.test(line.text)));
}

function isContentImage(image: BrochureImage) {
  return image.y >= 55;
}

function isContentDecoration(decoration: BrochureDecoration) {
  if (
    'x1' in decoration &&
    typeof decoration.y1 === 'number' &&
    typeof decoration.y2 === 'number'
  ) {
    const horizontal = Math.abs(decoration.y2 - decoration.y1) < 0.1;
    const runningRule =
      horizontal && (decoration.y1 < 55 || decoration.y1 > 800);
    return !runningRule;
  }
  return (
    'y' in decoration && typeof decoration.y === 'number' && decoration.y >= 55
  );
}

function resolveDecorationColor(color: string | undefined) {
  if (!color) return color;
  if (color === '#747474') return 'var(--brochure-rule)';
  if (color === '#242424') return 'var(--brochure-table)';
  return color;
}

function PageDecoration({ decoration }: { decoration: BrochureDecoration }) {
  if ('x1' in decoration) {
    return (
      <line
        x1={decoration.x1}
        y1={decoration.y1}
        x2={decoration.x2}
        y2={decoration.y2}
        stroke={resolveDecorationColor(decoration.color)}
        strokeWidth={decoration.width}
        vectorEffect="non-scaling-stroke"
      />
    );
  }

  return (
    <rect
      x={decoration.x}
      y={decoration.y}
      width={decoration.w}
      height={decoration.h}
      stroke={resolveDecorationColor(decoration.stroke)}
      fill={resolveDecorationColor(decoration.fill)}
      strokeWidth={decoration.strokeWidth}
      vectorEffect="non-scaling-stroke"
    />
  );
}

function DesktopPage({ page }: { page: (typeof data.pages)[number] }) {
  return (
    <div className="brochure-page__canvas">
      <svg
        className="brochure-page__decoration"
        viewBox={`0 0 ${page.width} ${page.height}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        {page.decorations
          .filter(isContentDecoration)
          .map((decoration, index) => (
            <PageDecoration
              decoration={decoration}
              key={`${decoration.type}-${index}`}
            />
          ))}
      </svg>

      {page.images.filter(isContentImage).map((image, index) => (
        <img
          className={`brochure-page__positioned-image${needsLightLogoBacking(image.src) ? ' has-light-logo-backing' : ''}`}
          src={image.src}
          alt=""
          key={`${image.src}-${index}`}
          draggable={false}
          style={{
            left: percent(image.x, page.width),
            top: percent(image.y, page.height),
            width: percent(image.w, page.width),
            height: percent(image.h, page.height),
          }}
        />
      ))}

      {page.lines.filter(isContentLine).map((line, index) => (
        <span
          className={`brochure-page__positioned-line${line.bold ? ' is-bold' : ''}${line.accent ? ' is-accent' : ''}`}
          key={`${line.x}-${line.y}-${index}`}
          style={{
            left: percent(line.x, page.width),
            top: percent(
              line.font.includes('ArialMT') &&
                line.size === 20 &&
                line.y === 271.5
                ? line.y + 20
                : line.y,
              page.height,
            ),
            width: percent(line.w, page.width),
            height: percent(line.h, page.height),
            fontSize: `${(line.size / page.width) * 100}cqw`,
            fontFamily: getFontFamily(line.font),
          }}
        >
          {line.text}
        </span>
      ))}
    </div>
  );
}

function MobilePage({ page }: { page: (typeof data.pages)[number] }) {
  const items = [
    ...page.lines.filter(isContentLine).map((line, index) => ({
      kind: 'line' as const,
      line,
      index,
      y: line.y,
      x: line.x,
    })),
    ...page.images.filter(isContentImage).map((image, index) => ({
      kind: 'image' as const,
      image,
      index,
      y: image.y,
      x: image.x,
    })),
  ].sort((a, b) => a.y - b.y || a.x - b.x || a.kind.localeCompare(b.kind));

  return (
    <div className="brochure-page__mobile-flow">
      {items.map((item) =>
        item.kind === 'line' ? (
          <p
            className={`brochure-page__mobile-line${item.line.bold ? ' is-bold' : ''}${item.line.size >= 40 ? ' is-index' : ''}${item.line.size >= 18 && item.line.size < 40 ? ' is-heading' : ''}`}
            key={`line-${item.index}`}
            style={{ fontFamily: getFontFamily(item.line.font) }}
          >
            {item.line.text}
          </p>
        ) : (
          <img
            className={`brochure-page__mobile-image${needsLightLogoBacking(item.image.src) ? ' has-light-logo-backing' : ''}`}
            src={item.image.src}
            alt={item.image.alt}
            key={`image-${item.index}`}
            loading="lazy"
            draggable={false}
            style={{
              width: percent(item.image.w, page.width),
              maxWidth: '100%',
            }}
          />
        ),
      )}
    </div>
  );
}

export default function ProductBrochure() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const targetId = decodeURIComponent(hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        block: 'start',
        behavior: 'instant',
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <div className="product-brochure" lang="zh">
      <div className="product-brochure__pages">
        {data.pages.map((page) => (
          <article
            className="brochure-page"
            id={page.id}
            key={page.sourcePage}
            aria-label={`Product handbook page ${page.sourcePage}`}
          >
            <DesktopPage page={page} />
            <MobilePage page={page} />
          </article>
        ))}
      </div>
    </div>
  );
}

export { data as productBrochureData, fontFaces };
export type { BrochureImage, BrochureLine };
