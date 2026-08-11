import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSiteSection, siteSections } from '@/siteSections';

interface ScrollNavigationState {
  scrollToSection?: boolean;
  scrollSpy?: boolean;
}

export default function SectionRouteSync() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  const activePathRef = useRef(location.pathname);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    activePathRef.current = location.pathname;

    const state = location.state as ScrollNavigationState | null;
    if (state?.scrollSpy) return;

    const section = getSiteSection(location.pathname);
    const target = section
      ? document.getElementById(section.id)
      : location.pathname === '/'
        ? document.documentElement
        : null;

    if (!target) return;

    const frame = window.requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: state?.scrollToSection ? 'smooth' : 'auto',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.key, location.pathname, location.state]);

  useEffect(() => {
    let animationFrame = 0;

    const updateRoute = () => {
      animationFrame = 0;
      const marker = Math.min(120, window.innerHeight * 0.2);
      let nextPath = '/';

      for (const section of siteSections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const bounds = element.getBoundingClientRect();
        if (bounds.top > marker) break;

        nextPath = section.path;
        if (bounds.bottom > marker) break;
      }

      if (nextPath === activePathRef.current) return;

      activePathRef.current = nextPath;
      navigateRef.current(nextPath, {
        replace: true,
        state: { scrollSpy: true },
      });
    };

    const handleScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateRoute);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return null;
}
