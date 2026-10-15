import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './product-table-of-contents.css';

interface PageTableOfContentsProps {
  chapters: Array<{ id: string; label: string }>;
  title: string;
  pathname: string;
  contentSelector: string;
}

export default function PageTableOfContents({
  chapters,
  title,
  pathname,
  contentSelector,
}: PageTableOfContentsProps) {
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(chapters[0].id);
  const [visible, setVisible] = useState(true);
  const nav = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = chapters.map((chapter) =>
        document.getElementById(chapter.id),
      );
      const first = sections[0];
      const last = document.querySelector(contentSelector);
      if (!first || !last) return;
      setVisible(
        first.getBoundingClientRect().top < window.innerHeight &&
          last.getBoundingClientRect().bottom > 120,
      );
      let current = chapters[0].id;
      for (const section of sections) {
        if (section && section.getBoundingClientRect().top <= 140)
          current = section.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    const brochure = document.querySelector(contentSelector);
    if (brochure) observer.observe(brochure);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [chapters, contentSelector]);

  useEffect(() => {
    if (!expanded) return;
    const dismiss = (event: PointerEvent) => {
      if (!nav.current?.contains(event.target as Node)) setExpanded(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [expanded]);

  return (
    <nav
      ref={nav}
      className="product-toc"
      aria-label={title}
      data-expanded={expanded}
      hidden={!visible}
      onPointerEnter={(event) => {
        if (
          event.pointerType === 'mouse' &&
          window.matchMedia('(min-width: 1101px) and (hover: hover)').matches
        )
          setExpanded(true);
      }}
      onPointerLeave={() => {
        if (!nav.current?.contains(document.activeElement)) setExpanded(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setExpanded(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          trigger.current?.focus();
          setExpanded(false);
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="product-toc__trigger"
        aria-label={title}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((value) => !value)}
        onFocus={(event) => {
          if (event.currentTarget.matches(':focus-visible')) setExpanded(true);
        }}
      >
        {chapters.map((chapter) => (
          <span
            key={chapter.id}
            className={chapter.id === active ? 'is-active' : undefined}
            aria-hidden="true"
          />
        ))}
      </button>
      <div className="product-toc__panel" id={panelId} hidden={!expanded}>
        <p className="product-toc__heading">{title}</p>
        <ol>
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <Link
                to={{ pathname, hash: `#${chapter.id}` }}
                aria-current={chapter.id === active ? 'location' : undefined}
                onClick={() => {
                  document.getElementById(chapter.id)?.scrollIntoView({
                    block: 'start',
                    behavior: 'instant',
                  });
                  setActive(chapter.id);
                  trigger.current?.focus();
                  setExpanded(false);
                }}
              >
                <span className="product-toc__number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{chapter.label}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
