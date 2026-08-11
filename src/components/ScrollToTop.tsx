import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteSectionPaths } from '@/siteSections';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/' || siteSectionPaths.has(pathname)) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}
