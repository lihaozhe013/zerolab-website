import { Box, Typography, useMediaQuery } from '@mui/material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export interface ProductShowcaseItem {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  href: string;
  linkText: string;
}

interface ProductScrollShowcaseProps {
  items: ProductShowcaseItem[];
}

function Destination({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (href.startsWith('/document/')) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

export default function ProductScrollShowcase({
  items,
}: ProductScrollShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const useStaticLayout = useMediaQuery(
    '(max-width: 767px), (prefers-reduced-motion: reduce)',
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || useStaticLayout) return;

    const context = gsap.context(() => {
      const overview = section.querySelector<HTMLElement>(
        '[data-product-overview]',
      );
      const cards = gsap.utils.toArray<HTMLElement>('[data-product-card]');
      const stage = section.querySelector<HTMLElement>('[data-product-stage]');
      const mediaTrack = section.querySelector<HTMLElement>(
        '[data-product-media-track]',
      );
      const copyViewport = section.querySelector<HTMLElement>(
        '[data-product-copy-viewport]',
      );
      const copyTrack = section.querySelector<HTMLElement>(
        '[data-product-copy-track]',
      );
      const stackingCards = cards.slice(1);
      const hold = { value: 0 };
      const getStackRect = () => {
        const cardRect = cards[0]?.getBoundingClientRect();
        const parentRect = stage?.offsetParent?.getBoundingClientRect();

        return {
          left: (cardRect?.left ?? 0) - (parentRect?.left ?? 0),
          top: (cardRect?.top ?? 0) - (parentRect?.top ?? 0),
          width: cardRect?.width ?? 0,
          height: cardRect?.height ?? 0,
        };
      };

      gsap.set(cards, {
        clipPath: 'inset(100% 0% 0% 0%)',
        y: 96,
        zIndex: (index) => cards.length - index,
      });
      gsap.set([stage, copyViewport], { autoAlpha: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(
          cards,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            duration: 0.65,
            stagger: 0.055,
            ease: 'power3.out',
          },
          0,
        )
        .to(
          stackingCards,
          {
            x: (_index, target) =>
              cards[0].offsetLeft - (target as HTMLElement).offsetLeft,
            y: (_index, target) =>
              cards[0].offsetTop - (target as HTMLElement).offsetTop,
            duration: 0.72,
            stagger: 0.08,
          },
          0.95,
        )
        .set(stage, { autoAlpha: 1 }, 2.05)
        .set(overview, { autoAlpha: 0 }, 2.05)
        .fromTo(
          stage,
          {
            left: () => getStackRect().left,
            top: () => getStackRect().top,
            width: () => getStackRect().width,
            height: () => getStackRect().height,
          },
          {
            left: 16,
            top: 16,
            width: () => section.clientWidth * (7 / 12) - 16,
            height: () => window.innerHeight - 32,
            duration: 0.82,
            ease: 'power2.inOut',
            immediateRender: false,
          },
          2.05,
        )
        .set(copyViewport, { autoAlpha: 1 }, 2.82);

      for (let index = 1; index < items.length; index += 1) {
        const position = 3.45 + (index - 1) * 1.12;
        timeline
          .to(
            mediaTrack,
            {
              xPercent: -100 * index,
              duration: 0.72,
              ease: 'power2.inOut',
            },
            position,
          )
          .to(
            copyTrack,
            {
              yPercent: -100 * index,
              duration: 0.72,
              ease: 'power2.inOut',
            },
            position,
          );
      }

      const finalPosition = 3.45 + (items.length - 2) * 1.12 + 0.95;
      timeline.to(hold, { value: 1, duration: 0.72 }, finalPosition);
    }, section);

    return () => context.revert();
  }, [items, useStaticLayout]);

  if (useStaticLayout) {
    return (
      <Box component="section" className="bg-page px-6 pb-28 pt-12 text-ink">
        <Box className="mx-auto max-w-[1280px]">
          <Box className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-3">
            {items.map((item) => (
              <Box
                key={item.title}
                className="w-[44vw] max-w-[190px] shrink-0 snap-start overflow-hidden bg-panel"
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  className="aspect-[3/4] w-full object-contain"
                />
              </Box>
            ))}
          </Box>

          <Box className="mt-24 space-y-28">
            {items.map((item) => (
              <Destination
                key={item.title}
                href={item.href}
                className="group block"
              >
                <Box className="overflow-hidden bg-panel">
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    className="aspect-[3/4] w-full object-contain"
                  />
                </Box>
                {item.eyebrow && (
                  <Typography className="mt-7 text-xs font-semibold tracking-[0.18em] text-[#4bd0e4]">
                    {item.eyebrow}
                  </Typography>
                )}
                <Typography
                  component="h2"
                  sx={{
                    fontSize: 32,
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: '-0.04em',
                  }}
                  className={item.eyebrow ? 'mt-3' : 'mt-7'}
                >
                  {item.title}
                </Typography>
                <Typography className="mt-5 text-sm leading-7 text-muted">
                  {item.description}
                </Typography>
                <Typography className="mt-8 text-sm font-semibold text-[#4bd0e4]">
                  {item.linkText}
                </Typography>
              </Destination>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  const stageItems = items;

  return (
    <Box
      ref={sectionRef}
      component="section"
      className="relative bg-page text-ink"
      style={{ height: `${200 + items.length * 100}dvh` }}
    >
      <Box className="sticky top-0 min-h-[100dvh] overflow-hidden">
        <Box
          data-product-overview
          className="absolute inset-0 flex items-center px-[6vw] pb-[7vh] pt-[13vh]"
        >
          <Box className="mx-auto grid w-full max-w-[1280px] grid-flow-dense grid-cols-5 gap-4">
            {items.map((item, index) => (
              <Box
                key={item.title}
                data-product-card
                className={
                  index % 2 === 1
                    ? 'relative mt-12 overflow-hidden bg-panel'
                    : 'relative overflow-hidden bg-panel'
                }
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  className="aspect-[3/4] w-full object-contain"
                />
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          data-product-stage
          className="invisible absolute z-10 overflow-hidden bg-panel opacity-0"
        >
          <Box
            data-product-media-track
            className="flex h-full will-change-transform"
          >
            {stageItems.map((item) => (
              <Destination
                key={item.title}
                href={item.href}
                className="group relative h-full w-full shrink-0 overflow-hidden"
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-contain"
                />
                <Box className="absolute inset-0 bg-black/10" />
              </Destination>
            ))}
          </Box>
        </Box>

        <Box
          data-product-copy-viewport
          className="invisible absolute bottom-[10vh] left-[63.333vw] right-[5vw] top-[14vh] overflow-hidden opacity-0"
        >
          <Box data-product-copy-track className="h-full will-change-transform">
            {stageItems.map((item) => (
              <Destination
                key={item.title}
                href={item.href}
                className="group flex h-full flex-col justify-end"
              >
                {item.eyebrow && (
                  <Typography className="mb-5 text-xs font-semibold tracking-[0.18em] text-[#4bd0e4]">
                    {item.eyebrow}
                  </Typography>
                )}
                <Typography
                  component="h2"
                  sx={{
                    fontSize: 'clamp(34px, 4vw, 62px)',
                    fontWeight: 600,
                    lineHeight: 0.98,
                    letterSpacing: '-0.05em',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography className="mt-7 max-w-[500px] text-sm leading-7 text-muted">
                  {item.description}
                </Typography>
                <Typography className="mt-10 text-sm font-semibold text-[#08b4ce] transition-colors duration-500 group-hover:text-ink">
                  {item.linkText}
                </Typography>
              </Destination>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
