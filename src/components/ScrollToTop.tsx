import { useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const positions = new Map<string, number>();

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    const { pathname, hash, key, state } = location;
    const positionKey = `${key}:${pathname}:${hash}`;
    const restoreCatalog = pathname === '/product' && state?.restoreCatalog;
    const restore = restoreCatalog
      ? state.catalogScrollY
      : navigationType === 'POP'
        ? positions.get(positionKey)
        : undefined;
    const frame = requestAnimationFrame(() => {
      if (restore !== undefined) {
        window.scrollTo({ top: restore, left: 0, behavior: 'instant' });
      } else if (hash) {
        document
          .getElementById(decodeURIComponent(hash.slice(1)))
          ?.scrollIntoView({ behavior: 'instant' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    });
    const savePosition = () => {
      positions.set(positionKey, window.scrollY);
    };
    window.addEventListener('scroll', savePosition, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', savePosition);
    };
  }, [location, navigationType]);

  return null;
}
