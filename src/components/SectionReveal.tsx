import { Box, type BoxProps } from '@mui/material';
import { useEffect, useRef } from 'react';

export default function SectionReveal({
  children,
  className = '',
  ...props
}: BoxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.dataset.visible = 'true';
        observer.disconnect();
      },
      { threshold: 0.16 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={ref} className={`section-reveal ${className}`} {...props}>
      {children}
    </Box>
  );
}
