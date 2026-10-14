import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { BrochurePage } from './productBrochureLayout';
import { needsLightLogoBacking } from './productBrochureLayout';
import type {
  ContentBlock,
  ContentImage,
  ContentPage,
} from './productBrochureContent';
import './english-brochure.css';

function BrochureImage({
  image,
  page,
  positioned = false,
}: {
  image: ContentImage;
  page: BrochurePage;
  positioned?: boolean;
}) {
  const { t } = useTranslation();
  const source = page.images[image.index];
  return (
    <img
      src={source.src}
      alt={t(image.altKey)}
      width={Math.round(source.w * 100)}
      height={Math.round(source.h * 100)}
      className={`${positioned ? 'english-brochure__positioned-image' : 'english-brochure__image'}${source.src.includes('/logos/') ? ' is-logo' : ''}${needsLightLogoBacking(source.src) ? ' has-light-logo-backing' : ''}`}
      draggable={false}
    />
  );
}

function MediaComposition({
  block,
  page,
}: {
  block: Extract<ContentBlock, { type: 'media' | 'logos' }>;
  page: BrochurePage;
}) {
  const { t } = useTranslation();
  if (block.type === 'logos')
    return (
      <div className="english-brochure__logos">
        {block.images.map((image) => (
          <BrochureImage image={image} page={page} key={image.index} />
        ))}
      </div>
    );
  const sources = block.images.map((image) => page.images[image.index]);
  const left = Math.min(
    ...sources.map((image) => image.x),
    ...block.captions.map((c) => page.lines[c.line].x),
  );
  const top = Math.min(
    ...sources.map((image) => image.y),
    ...block.captions.map((c) => page.lines[c.line].baseline - 12),
  );
  const right = Math.max(...sources.map((image) => image.x + image.w));
  const bottom = Math.max(
    ...sources.map((image) => image.y + image.h),
    ...block.captions.map((c) => page.lines[c.line].baseline),
  );
  const width = right - left;
  const height = bottom - top;
  return (
    <div
      className="english-brochure__media"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {block.images.map((image) => {
        const source = page.images[image.index];
        return (
          <div
            className="english-brochure__image-placement"
            key={image.index}
            style={{
              left: `${((source.x - left) / width) * 100}%`,
              top: `${((source.y - top) / height) * 100}%`,
              width: `${(source.w / width) * 100}%`,
              height: `${(source.h / height) * 100}%`,
            }}
          >
            <BrochureImage image={image} page={page} positioned />
          </div>
        );
      })}
      {block.captions.map((caption) => {
        const line = page.lines[caption.line];
        return (
          <span
            className="english-brochure__media-caption"
            data-copy-key={caption.key}
            key={caption.key}
            style={{
              left: `${((line.x - left) / width) * 100}%`,
              top: `${((line.baseline - top) / height) * 100}%`,
            }}
          >
            {t(caption.key)}
          </span>
        );
      })}
    </div>
  );
}

function Block({ block, page }: { block: ContentBlock; page: BrochurePage }) {
  const { t } = useTranslation();
  if (block.type === 'text') {
    const text = t(block.key);
    if (!text) return null;
    const className = `english-brochure__${block.role}`;
    if (block.role === 'model')
      return (
        <h2 className={className} data-copy-key={block.key}>
          {text}
        </h2>
      );
    if (block.role === 'section_title' || block.role === 'title')
      return (
        <h3 className={className} data-copy-key={block.key}>
          {text}
        </h3>
      );
    return (
      <p className={className} data-copy-key={block.key}>
        {text}
      </p>
    );
  }
  if (block.type === 'media' || block.type === 'logos')
    return <MediaComposition block={block} page={page} />;
  if (block.type === 'features')
    return (
      <div className="english-brochure__features">
        <h4 data-copy-key={block.titleKey}>{t(block.titleKey)}</h4>
        <ul>
          {block.keys.map((key) => (
            <li key={key} data-copy-key={key}>
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
    );
  if (block.type === 'diagram') {
    const images = [...block.images].sort(
      (a, b) => page.images[a.index].x - page.images[b.index].x,
    );
    return (
      <div className="english-brochure__diagram">
        <div>
          {images[0] && <BrochureImage image={images[0]} page={page} />}
          <ul>
            {block.keys.map((key) => (
              <li key={key} data-copy-key={key}>
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
        {images[1] && <BrochureImage image={images[1]} page={page} />}
      </div>
    );
  }
  if (block.type === 'table')
    return (
      <div
        className="english-brochure__table-scroll"
        tabIndex={0}
        role="region"
        aria-label={t('product_brochure.accessibility.specifications')}
      >
        <table
          className={`english-brochure__table${block.columns === 3 ? ' is-comparison' : ''}`}
        >
          <colgroup>
            {Array.from({ length: block.columns }, (_, i) => (
              <col
                key={i}
                style={{
                  width:
                    block.columns === 2
                      ? i === 0
                        ? '40%'
                        : '60%'
                      : i === 0
                        ? '25%'
                        : '37.5%',
                }}
              />
            ))}
          </colgroup>
          <thead>
            <tr>
              {block.rows[0].map((key, i) => (
                <th key={i} scope="col" data-copy-key={key ?? undefined}>
                  {key ? t(key) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.slice(1).map((row, i) => (
              <tr key={i}>
                {row.map((key, j) =>
                  j === 0 ? (
                    <th scope="row" key={j} data-copy-key={key ?? undefined}>
                      {key ? t(key) : null}
                    </th>
                  ) : (
                    <td key={j} data-copy-key={key ?? undefined}>
                      {key ? t(key) : null}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  if (block.type === 'cards')
    return (
      <div
        className={`english-brochure__grid is-${block.kind}${block.kind === 'scenarios' && block.columns === 1 ? ' has-horizontal-cards' : ''}`}
        style={{ '--brochure-columns': block.columns } as CSSProperties}
      >
        {block.items.map((card) => (
          <div className="english-brochure__card" key={card.id}>
            {block.kind === 'partners' &&
              card.images.map((image) => (
                <BrochureImage key={image.index} image={image} page={page} />
              ))}
            <div className="english-brochure__card-copy">
              <h4 data-copy-key={card.titleKey}>{t(card.titleKey)}</h4>
              {card.descriptionKeys.map((key) => (
                <p key={key} data-copy-key={key}>
                  {t(key)}
                </p>
              ))}
            </div>
            {block.kind !== 'partners' &&
              card.images.map((image) => (
                <BrochureImage key={image.index} image={image} page={page} />
              ))}
          </div>
        ))}
      </div>
    );
}

export default function EnglishBrochurePage({
  page,
  content,
}: {
  page: BrochurePage;
  content: ContentPage;
}) {
  return (
    <div
      className={`english-brochure${page.sourcePage === 25 ? ' has-source-whitespace' : ''}`}
    >
      {content.blocks.map((section) => (
        <section className="english-brochure__section" key={section.id}>
          {section.children.map((block, i) => (
            <Block block={block} page={page} key={i} />
          ))}
        </section>
      ))}
    </div>
  );
}
