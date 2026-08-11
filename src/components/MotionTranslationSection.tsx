import { Box, Typography, useMediaQuery } from '@mui/material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export interface MotionTranslationStep {
  verb: string;
  title: string;
  description: string;
  image: string;
}

interface MotionTranslationSectionProps {
  heading: string;
  description: string;
  steps: MotionTranslationStep[];
}

export default function MotionTranslationSection({
  heading,
  description,
  steps,
}: MotionTranslationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const useStaticLayout = useMediaQuery(
    '(max-width: 767px), (prefers-reduced-motion: reduce)',
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || useStaticLayout) return;

    const context = gsap.context(() => {
      const images = gsap.utils.toArray<HTMLElement>('[data-motion-image]');
      const copy = gsap.utils.toArray<HTMLElement>('[data-motion-copy]');

      gsap.set(images, { autoAlpha: 0, scale: 1.04 });
      gsap.set(copy, { autoAlpha: 0, y: 28 });
      gsap.set(images[0], { autoAlpha: 1, scale: 1 });
      gsap.set(copy[0], { autoAlpha: 1, y: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      for (let index = 1; index < steps.length; index += 1) {
        const position = index;
        timeline
          .to(
            images[index - 1],
            { autoAlpha: 0, scale: 0.97, duration: 0.65, ease: 'none' },
            position,
          )
          .to(
            copy[index - 1],
            { autoAlpha: 0, y: -22, duration: 0.55, ease: 'none' },
            position,
          )
          .to(
            images[index],
            { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'none' },
            position,
          )
          .to(
            copy[index],
            { autoAlpha: 1, y: 0, duration: 0.55, ease: 'none' },
            position,
          );
      }
    }, section);

    return () => context.revert();
  }, [steps, useStaticLayout]);

  if (useStaticLayout) {
    return (
      <Box component="section" className="bg-section px-6 py-24 text-ink">
        <Box className="mx-auto max-w-[1280px]">
          <Typography
            component="h2"
            sx={{
              fontSize: 'clamp(38px, 10vw, 58px)',
              fontWeight: 600,
              lineHeight: 0.98,
              letterSpacing: '-0.045em',
            }}
            className="max-w-[760px] text-[clamp(38px,10vw,58px)] font-semibold leading-[0.98] tracking-[-0.045em]"
          >
            {heading}
          </Typography>
          <Typography className="mt-6 max-w-[620px] text-base leading-7 text-muted">
            {description}
          </Typography>

          <Box className="mt-16 space-y-20">
            {steps.map((step) => (
              <Box component="article" key={step.verb}>
                <Box className="overflow-hidden bg-panel">
                  <Box
                    component="img"
                    src={step.image}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                  />
                </Box>
                <Typography className="mt-7 text-sm font-semibold text-[#4bd0e4]">
                  {step.verb}
                </Typography>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: 30,
                    fontWeight: 600,
                    lineHeight: 1.15,
                    letterSpacing: '-0.03em',
                  }}
                  className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.03em]"
                >
                  {step.title}
                </Typography>
                <Typography className="mt-4 text-sm leading-6 text-muted">
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      ref={sectionRef}
      component="section"
      className="relative h-[320dvh] bg-section text-ink"
    >
      <Box className="sticky top-0 grid min-h-[100dvh] grid-cols-12 overflow-hidden">
        <Box className="col-span-5 flex flex-col justify-between px-[7vw] py-[12vh] pr-[5vw]">
          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: 'clamp(46px, 4.5vw, 76px)',
                fontWeight: 600,
                lineHeight: 0.95,
                letterSpacing: '-0.05em',
              }}
              className="max-w-[600px] text-[clamp(46px,4.5vw,76px)] font-semibold leading-[0.95] tracking-[-0.05em]"
            >
              {heading}
            </Typography>
            <Typography className="mt-7 max-w-[480px] text-base leading-7 text-muted">
              {description}
            </Typography>
          </Box>

          <Box className="relative h-[220px]">
            {steps.map((step) => (
              <Box
                key={step.verb}
                data-motion-copy
                className="absolute inset-x-0 bottom-0 opacity-0"
              >
                <Typography className="text-sm font-semibold text-[#4bd0e4]">
                  {step.verb}
                </Typography>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: 'clamp(30px, 3vw, 48px)',
                    fontWeight: 600,
                    lineHeight: 1.02,
                    letterSpacing: '-0.035em',
                  }}
                  className="mt-3 max-w-[480px] text-[clamp(30px,3vw,48px)] font-semibold leading-[1.02] tracking-[-0.035em]"
                >
                  {step.title}
                </Typography>
                <Typography className="mt-5 max-w-[440px] text-sm leading-6 text-muted">
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="relative col-span-7 m-4 ml-0 overflow-hidden bg-panel">
          {steps.map((step) => (
            <Box
              key={step.image}
              data-motion-image
              component="img"
              src={step.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-0"
            />
          ))}
          <Box className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
        </Box>
      </Box>
    </Box>
  );
}
