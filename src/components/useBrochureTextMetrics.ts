import { useLayoutEffect, type RefObject } from 'react';

export default function useBrochureTextMetrics(
  root: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0;
    let disposed = false;

    const calibrate = () => {
      if (disposed) return;
      if (!window.matchMedia('(max-width: 768px)').matches) {
        const measurements = Array.from(
          element.querySelectorAll<HTMLElement>(
            '.brochure-page__positioned-line:not(.has-runs), .brochure-page__run',
          ),
        ).map((line) => {
          const text = line.querySelector<HTMLElement>('.brochure-page__text');
          const marker = text?.querySelector<HTMLElement>(
            '.brochure-page__baseline',
          );
          if (!text || !marker) return null;
          const previousScale = Number(text.dataset.scaleX || 1);
          const bounds = text.getBoundingClientRect();
          const naturalWidth = bounds.width / previousScale;
          if (!naturalWidth) return null;
          return {
            text,
            scale: line.getBoundingClientRect().width / naturalWidth,
            baseline: marker.getBoundingClientRect().top - bounds.top,
          };
        });

        // Read every line before writing, avoiding repeated synchronous layouts.
        for (const measurement of measurements) {
          if (!measurement) continue;
          const { text, scale, baseline } = measurement;
          text.dataset.scaleX = String(scale);
          text.style.transform = `translateY(${-baseline}px) scaleX(${scale})`;
        }
      }
      if (import.meta.env.DEV) {
        void import('./productBrochureAudit').then(
          ({ auditProductBrochure }) => {
            if (!disposed)
              element.dataset.alignmentAudit = JSON.stringify(
                auditProductBrochure(),
              );
          },
        );
      }
    };

    const schedule = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(calibrate);
    };
    calibrate();
    void document.fonts.ready.then(schedule);
    document.fonts.addEventListener('loadingdone', schedule);
    element.addEventListener('load', schedule, true);
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    const themeObserver = new MutationObserver(schedule);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'lang'],
    });
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      document.fonts.removeEventListener('loadingdone', schedule);
      element.removeEventListener('load', schedule, true);
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, [root]);
}
