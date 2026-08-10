import { Box, Typography } from '@mui/material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';

gsap.registerPlugin(ScrollTrigger);

interface HeroKineticCopyProps {
  heroRef: RefObject<HTMLDivElement | null>;
  title: string;
  children: ReactNode;
}

type GlyphStyle = CSSProperties & {
  '--glyph-drift': string;
  '--glyph-tilt': string;
};

function KineticTitle({ title }: { title: string }) {
  const lines = useMemo(() => title.split('\n'), [title]);
  let glyphIndex = 0;

  return (
    <Typography
      variant="h1"
      aria-label={title.replaceAll('\n', ' ')}
      sx={{
        fontSize: { xs: 'clamp(42px, 11vw, 62px)', md: 'clamp(64px, 7vw, 108px)' },
        fontWeight: 650,
        letterSpacing: '-0.06em',
        lineHeight: 0.9,
        textWrap: 'balance',
      }}
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(' ');
        return (
          <span key={`${title}-${lineIndex}`} aria-hidden="true">
            {words.map((word, wordIndex) => (
              <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
                {Array.from(word).map((glyph) => {
                  const index = glyphIndex++;
                  const style: GlyphStyle = {
                    '--glyph-drift': `${((index % 5) - 2) * 4}px`,
                    '--glyph-tilt': `${((index % 4) - 1.5) * 1.2}deg`,
                  };
                  return (
                    <span key={`${glyph}-${index}`} className="hero-kinetic-glyph" style={style}>
                      {glyph}
                    </span>
                  );
                })}
                {wordIndex < words.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
            {lineIndex < lines.length - 1 && <br />}
          </span>
        );
      })}
    </Typography>
  );
}

export default function HeroKineticCopy({
  heroRef,
  title,
  children,
}: HeroKineticCopyProps) {
  const copyRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(query.matches);
    query.addEventListener('change', updatePreference);
    return () => query.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const copy = copyRef.current;
    const details = detailsRef.current;
    const media = hero?.querySelector<HTMLVideoElement>('[data-hero-media]');
    if (!hero || !media || !copy || !details) return;

    media.pause();
    media.currentTime = 0;

    const context = gsap.context(() => {
      const glyphs = copy.querySelectorAll<HTMLElement>('.hero-kinetic-glyph');
      let isVideoPlaying = false;
      const holdProgress = { value: 0 };

      const finalScale = () => (window.innerWidth < 768 ? 0.82 : 0.68);
      const finalX = () => {
        const rect = copy.getBoundingClientRect();
        const inset = window.innerWidth < 768 ? 24 : window.innerWidth * 0.08;
        return inset - rect.left;
      };
      const finalY = () => {
        const rect = copy.getBoundingClientRect();
        const bottomInset = window.innerHeight * (window.innerWidth < 768 ? 0.1 : 0.12);
        return window.innerHeight - bottomInset - rect.top - rect.height * finalScale();
      };

      if (reducedMotion) {
        gsap.set(glyphs, { autoAlpha: 1, clearProps: 'transform,filter' });
        gsap.set(media, { autoAlpha: 1 });
        gsap.set(copy, { x: finalX, y: finalY, scale: finalScale });
        gsap.set(details, {
          autoAlpha: 1,
          y: 0,
          scale: () => 1 / finalScale(),
          transformOrigin: 'left top',
        });
        return;
      }

      gsap.set(media, { autoAlpha: 0 });
      gsap.set(details, {
        autoAlpha: 0,
        y: 24,
        scale: () => 1 / finalScale(),
        transformOrigin: 'left top',
      });
      gsap.set(copy, { x: 0, y: 0, scale: 1, transformOrigin: 'left top' });

      const entrance = gsap.timeline({ defaults: { ease: 'power4.out' } });
      entrance.to(glyphs, {
        autoAlpha: 1,
        y: 0,
        x: 0,
        rotate: 0,
        filter: 'blur(0px)',
        duration: 1.05,
        stagger: 0.025,
      });

      const scrollTimeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            const shouldPlay = progress >= 0.4;
            if (shouldPlay === isVideoPlaying) return;

            isVideoPlaying = shouldPlay;
            if (shouldPlay) {
              void media.play().catch(() => {
                isVideoPlaying = false;
              });
            } else {
              media.pause();
            }
          },
        },
      });

      scrollTimeline
        .to(copy, { x: finalX, y: finalY, scale: finalScale, duration: 0.72 }, 0)
        .to(media, { autoAlpha: 1, duration: 0.44 }, 0.72)
        .to(details, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.74)
        // Extending the scrub timeline creates a calm reading beat after the media is fully revealed.
        .to(holdProgress, { value: 1, duration: 0.65 }, 1.16);
    }, copy);

    return () => {
      media.pause();
      context.revert();
    };
  }, [heroRef, reducedMotion, title]);

  return (
    <Box className="absolute inset-0 flex items-center justify-center px-6 md:px-[6vw]">
      <Box
        ref={copyRef}
        className="w-max max-w-[88vw] text-white will-change-transform"
        sx={{ transformOrigin: 'left top' }}
      >
        <KineticTitle title={title} />
        <Box
          ref={detailsRef}
          className="mt-7 max-w-[620px] opacity-0 will-change-[opacity,transform] md:mt-9"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
