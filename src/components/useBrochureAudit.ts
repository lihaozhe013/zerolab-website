import { useEffect, type RefObject } from 'react';

export default function useBrochureAudit(
  root: RefObject<HTMLDivElement | null>,
  language: string,
) {
  useEffect(() => {
    if (!import.meta.env.DEV || !root.current) return;
    const element = root.current;
    let disposed = false;
    let frame = 0;
    const schedule = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          void import('./productBrochureAudit').then(
            ({ auditProductBrochure }) => {
              if (!disposed)
                element.dataset.alignmentAudit = JSON.stringify(
                  auditProductBrochure(),
                );
            },
          );
        });
      });
    };
    schedule();
    void document.fonts.ready.then(schedule);
    document.fonts.addEventListener('loadingdone', schedule);
    element.addEventListener('load', schedule, true);
    const resize = new ResizeObserver(schedule);
    resize.observe(element);
    const theme = new MutationObserver(schedule);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'lang'],
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      theme.disconnect();
      element.removeEventListener('load', schedule, true);
      document.fonts.removeEventListener('loadingdone', schedule);
    };
  }, [root, language]);
}
