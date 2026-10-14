import {
  getMobileSections,
  getFontFamily,
  needsLightLogoBacking,
  type BrochurePage,
  type BrochureLine,
  type BrochureImage,
} from './productBrochureLayout';

function SourceCopy({
  line,
  heading = false,
}: {
  line: BrochureLine;
  heading?: boolean;
}) {
  return (
    <span data-brochure-copy style={{ fontFamily: getFontFamily(line.font) }}>
      {line.runs.length
        ? line.runs.map((run, i) => (
            <span
              className="brochure-page__copy-run"
              key={i}
              style={{
                fontFamily: getFontFamily(run.font),
                fontWeight: run.bold ? 700 : 400,
                fontSize: heading ? (run.bold ? 18 : 16) : undefined,
                color: run.bold
                  ? 'var(--brochure-text)'
                  : 'var(--brochure-muted)',
              }}
            >
              {run.text}
            </span>
          ))
        : line.text}
    </span>
  );
}

function MobileImage({ image }: { image: BrochureImage }) {
  return (
    <img
      className={`brochure-page__mobile-image${image.src.includes('/logos/') ? ' is-logo' : ''}${needsLightLogoBacking(image.src) ? ' has-light-logo-backing' : ''}`}
      src={image.src}
      alt={image.alt}
      width={Math.round(image.w * 100)}
      height={Math.round(image.h * 100)}
      draggable={false}
    />
  );
}

function groupTextLines(lines: BrochureLine[]) {
  const groups: BrochureLine[][] = [];
  for (const line of [...lines].sort(
    (a, b) => a.baseline - b.baseline || a.x - b.x,
  )) {
    const group = groups.at(-1);
    const previous = group?.at(-1);
    if (
      previous &&
      line.size < 18 &&
      line.size === previous.size &&
      line.bold === previous.bold &&
      Math.abs(line.x - previous.x) < 3 &&
      line.baseline - previous.baseline < line.size * 1.8
    ) {
      group!.push(line);
    } else groups.push([line]);
  }
  return groups;
}

function TextBlocks({ lines }: { lines: BrochureLine[] }) {
  return groupTextLines(lines).map((group, index) => {
    const line = group[0];
    return (
      <p
        className={`brochure-page__mobile-line${line.bold ? ' is-bold' : ''}${line.size >= 40 ? ' is-index' : ''}${line.size >= 18 && line.size < 40 ? ' is-heading' : ''}`}
        key={index}
        style={{ fontFamily: getFontFamily(line.font) }}
      >
        {group.map((item, i) => (
          <SourceCopy line={item} key={i} />
        ))}
      </p>
    );
  });
}

function LooseContent({
  lines,
  images,
}: {
  lines: BrochureLine[];
  images: BrochureImage[];
}) {
  if (
    images.length > 0 &&
    images.every((image) => image.src.includes('/logos/'))
  ) {
    return (
      <>
        <TextBlocks lines={lines} />
        <div className="brochure-page__mobile-images is-logos">
          {[...images]
            .sort((a, b) => a.x - b.x)
            .map((image, i) => (
              <MobileImage image={image} key={i} />
            ))}
        </div>
      </>
    );
  }
  const captions = new Map<BrochureImage, BrochureLine[]>();
  const body = lines.filter((line) => {
    const image = images.find(
      (image) =>
        line.size <= 10 &&
        Math.abs(image.x - line.x) < 3 &&
        line.baseline >= image.y + image.h &&
        line.baseline < image.y + image.h + 30,
    );
    if (!image) return true;
    captions.set(image, [...(captions.get(image) || []), line]);
    return false;
  });
  const items = [
    ...groupTextLines(body).map((group) => ({
      kind: 'text' as const,
      group,
      y: group[0].baseline - group[0].size,
      x: group[0].x,
    })),
    ...images.map((image) => ({
      kind: 'image' as const,
      image,
      y: image.y,
      x: image.x,
    })),
  ].sort((a, b) => a.y - b.y || a.x - b.x);
  return items.map((item, i) =>
    item.kind === 'image' ? (
      <figure className="brochure-page__mobile-figure" key={i}>
        <MobileImage image={item.image} />
        {captions.has(item.image) && (
          <figcaption>
            <TextBlocks lines={captions.get(item.image)!} />
          </figcaption>
        )}
      </figure>
    ) : (
      <TextBlocks lines={item.group} key={i} />
    ),
  );
}

type MobileSection = ReturnType<typeof getMobileSections>[number];

function MobileCard({ card }: { card: MobileSection['cards'][number] }) {
  return (
    <div
      className={`brochure-page__mobile-card${card.images.some((image) => image.src.includes('/logos/')) ? ' is-partner' : ''}`}
    >
      {card.images
        .filter((image) => image.y < card.anchor.baseline)
        .map((image, i) => (
          <MobileImage image={image} key={i} />
        ))}
      <h3 data-brochure-copy>{card.anchor.text}</h3>
      <TextBlocks lines={card.lines} />
      {card.images
        .filter((image) => image.y >= card.anchor.baseline)
        .map((image, i) => (
          <MobileImage image={image} key={i} />
        ))}
    </div>
  );
}

function MobileTable({
  table,
}: {
  table: NonNullable<MobileSection['table']>;
}) {
  return (
    <div className="brochure-page__mobile-table-scroll" tabIndex={0}>
      <table
        className={`brochure-page__mobile-table${table.columns.length === 4 ? ' is-comparison' : ''}`}
      >
        <colgroup>
          {table.columns.slice(0, -1).map((left, i) => (
            <col
              key={i}
              style={{
                width:
                  table.columns.length === 3
                    ? i === 0
                      ? '40%'
                      : '60%'
                    : `${((table.columns[i + 1] - left) / (table.columns.at(-1)! - table.columns[0])) * 100}%`,
              }}
            />
          ))}
        </colgroup>
        <thead>
          <tr>
            {table.cells[0].map((cell, i) => (
              <th key={i} scope="col">
                {cell.map((line, j) => (
                  <SourceCopy line={line} key={j} />
                ))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.cells.slice(1).map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                j === 0 ? (
                  <th scope="row" key={j}>
                    {cell.map((line, k) => (
                      <SourceCopy line={line} key={k} />
                    ))}
                  </th>
                ) : (
                  <td key={j}>
                    {cell.map((line, k) => (
                      <SourceCopy line={line} key={k} />
                    ))}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MobileBrochurePage({ page }: { page: BrochurePage }) {
  const sections = getMobileSections(page);
  return (
    <div className="brochure-page__mobile-flow">
      {sections.map((section, index) => {
        const content = [
          ...section.cards.map((card, i) => ({
            y: card.anchor.baseline,
            node: <MobileCard card={card} key={`card-${i}`} />,
          })),
          ...(section.table
            ? [
                {
                  y: section.table.top,
                  node: <MobileTable table={section.table} key="table" />,
                },
              ]
            : []),
        ].sort((a, b) => a.y - b.y);
        return (
          <section className="brochure-page__mobile-section" key={index}>
            {section.title.length > 0 && (
              <h2 className="brochure-page__mobile-section-title">
                {section.title.map((line, i) => (
                  <SourceCopy line={line} key={i} heading />
                ))}
              </h2>
            )}
            <LooseContent lines={section.lines} images={section.images} />
            {content.map((item) => item.node)}
          </section>
        );
      })}
    </div>
  );
}
