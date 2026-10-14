import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import data from '@/content/productBrochureData.json';
import EnglishBrochurePage from './EnglishBrochurePage';
import { brochureContent, localizeSourcePage } from './productBrochureContent';
import useBrochureAudit from './useBrochureAudit';
import './product-brochure.css';
import useBrochureTextMetrics from './useBrochureTextMetrics';
import MobileBrochurePage from './MobileBrochurePage';
import {
  getFontFamily,
  getPageTable,
  isContentLine,
  isContentImage,
  isSectionHeading,
  needsLightLogoBacking,
  type BrochureDecoration,
  type BrochureLine,
  type BrochureImage,
} from './productBrochureLayout';

const fontFaces = {
  'arial-regular': 'Brochure Arial',
  'arial-narrow-bold': 'Brochure Arial Narrow',
} as const;

function percent(value: number, total: number) {
  return `${(value / total) * 100}%`;
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
        strokeDasharray={decoration.dash?.join(' ') || undefined}
        strokeLinecap={decoration.dash?.length ? 'round' : undefined}
      />
    );
  }

  return (
    <rect
      x={decoration.x}
      y={decoration.y}
      width={decoration.w}
      height={decoration.h}
      stroke="none"
      fill={resolveDecorationColor(decoration.fill)}
      strokeWidth={decoration.strokeWidth}
    />
  );
}

function DesktopPage({ page }: { page: (typeof data.pages)[number] }) {
  const table = getPageTable(page);
  return (
    <div className="brochure-page__canvas">
      <svg
        className="brochure-page__decoration"
        viewBox={`0 0 ${page.width} ${page.height}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        {table && (
          <rect
            className="brochure-page__table-header"
            x={table.columns[0]}
            y={table.top}
            width={table.columns.at(-1)! - table.columns[0]}
            height={table.rowHeight}
          />
        )}
        {page.decorations
          .filter(isContentDecoration)
          .sort((a, b) => Number(a.type === 'line') - Number(b.type === 'line'))
          .map((decoration, index) => (
            <PageDecoration
              decoration={decoration}
              key={`${decoration.type}-${index}`}
            />
          ))}
        {page.lines.filter(isSectionHeading).map((line, index) => {
          const baseline = line.runs[0]?.baseline ?? line.baseline;
          return (
            <polygon
              className="brochure-page__section-marker"
              key={`marker-${index}`}
              points={`${line.x - 19.97},${baseline - 17} ${line.x - 7.97},${baseline - 8} ${line.x - 19.97},${baseline + 1}`}
            />
          );
        })}
      </svg>

      {page.images.filter(isContentImage).map((image, index) => (
        <img
          className={`brochure-page__positioned-image${needsLightLogoBacking(image.src) ? ' has-light-logo-backing' : ''}`}
          src={image.src}
          alt={image.alt}
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
          className={`brochure-page__positioned-line${line.bold ? ' is-bold' : ''}${line.accent ? ' is-accent' : ''}${line.runs.length ? ' has-runs' : ''}`}
          data-source-baseline={line.baseline}
          data-source-width={line.w}
          key={`${line.x}-${line.y}-${index}`}
          style={{
            left: percent(line.x, page.width),
            top: percent(line.baseline, page.height),
            width: percent(line.w, page.width),
            fontSize: `${(line.size / page.width) * 100}cqw`,
            fontFamily: getFontFamily(line.font),
          }}
        >
          {line.runs.length ? (
            line.runs.map((run, i) => (
              <span
                className={`brochure-page__run${run.bold ? ' is-bold' : ''}`}
                key={i}
                style={{
                  left: percent(run.x - line.x, line.w),
                  top: `${((run.baseline - line.baseline) / page.width) * 100}cqw`,
                  width: percent(run.w, line.w),
                  fontSize: `${(run.size / page.width) * 100}cqw`,
                  fontFamily: getFontFamily(run.font),
                }}
              >
                <span className="brochure-page__text">
                  {run.text}
                  <span
                    className="brochure-page__baseline"
                    aria-hidden="true"
                  />
                </span>
              </span>
            ))
          ) : (
            <span className="brochure-page__text">
              {line.text}
              <span className="brochure-page__baseline" aria-hidden="true" />
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export default function ProductBrochure() {
  const { hash } = useLocation();
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const isEnglish = language.startsWith('en');
  const root = useRef<HTMLDivElement>(null);
  useBrochureTextMetrics(root, !isEnglish);

  useBrochureAudit(root, language);
  const pages = data.pages.map((page, index) =>
    isEnglish ? page : localizeSourcePage(page, brochureContent[index], t),
  );

  useEffect(() => {
    if (!hash) return;
    const targetId = decodeURIComponent(hash.slice(1));
    let disposed = false;
    let frame = 0;
    void document.fonts.ready.then(() => {
      if (disposed) return;
      frame = window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({
          block: 'start',
          behavior: 'instant',
        });
      });
    });
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
    };
  }, [hash]);

  return (
    <div
      className={`product-brochure${isEnglish ? ' is-english' : ''}`}
      lang={isEnglish ? 'en' : 'zh-CN'}
      data-renderer={isEnglish ? 'responsive' : 'source'}
      ref={root}
    >
      <div className="product-brochure__pages">
        {pages.map((page, index) => (
          <article
            className="brochure-page"
            id={page.id}
            key={page.sourcePage}
            aria-label={t('product_brochure.accessibility.section', {
              number: page.sourcePage,
            })}
          >
            {isEnglish ? (
              <EnglishBrochurePage
                page={page}
                content={brochureContent[index]}
              />
            ) : (
              <>
                <DesktopPage page={page} />
                <MobileBrochurePage page={page} />
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export { data as productBrochureData, fontFaces };
export type { BrochureImage, BrochureLine };
