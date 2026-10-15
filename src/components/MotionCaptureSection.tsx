import { Box, Typography, useMediaQuery } from '@mui/material';
import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { MotionMode } from './motion-capture/performance';

const MotionCaptureCanvas = lazy(() => import('./MotionCaptureCanvas'));

interface MotionCaptureSectionProps {
  heading: string;
  description: string;
  inPlaceLabel: string;
  rootMotionLabel: string;
  playLabel: string;
  pauseLabel: string;
  loadingLabel: string;
  fallbackAlt: string;
  sourceLabel: string;
  captureDeviceHeading: string;
  captureDeviceName: string;
  interactionLabel: string;
}

function StageFallback({ alt }: { alt: string }) {
  return (
    <Box className="absolute inset-0 overflow-hidden bg-[#11161a]">
      <Box
        component="img"
        src="/images/The virtual studio.jpg"
        alt={alt}
        className="h-full w-full object-cover opacity-35 grayscale"
      />
      <Box className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080b0e] via-[#080b0e]/20 to-[#080b0e]/60" />
    </Box>
  );
}

class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function MotionCaptureSection({
  heading,
  description,
  inPlaceLabel,
  rootMotionLabel,
  playLabel,
  pauseLabel,
  loadingLabel,
  fallbackAlt,
  sourceLabel,
  captureDeviceHeading,
  captureDeviceName,
  interactionLabel,
}: MotionCaptureSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)',
  );
  const [nearViewport, setNearViewport] = useState(false);
  const [webGLAvailable] = useState(supportsWebGL);
  const [mode, setMode] = useState<MotionMode>('in-place');
  const [playing, setPlaying] = useState(!prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) setPlaying(false);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: '320px 0px' },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const showScene = nearViewport && webGLAvailable === true;

  return (
    <Box
      ref={sectionRef}
      component="section"
      className="bg-section px-6 py-24 text-ink md:px-[6vw] md:py-36"
    >
      <Box className="mx-auto grid max-w-[1280px] grid-cols-1 overflow-hidden bg-panel md:min-h-[760px] md:grid-cols-12">
        <Box className="flex flex-col justify-between px-6 py-10 md:col-span-4 md:px-10 md:py-12 lg:px-14 lg:py-16">
          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: 'clamp(38px, 4.2vw, 68px)',
                fontWeight: 600,
                lineHeight: 0.96,
                letterSpacing: '-0.05em',
              }}
              className="max-w-[620px]"
            >
              {heading}
            </Typography>
            <Typography className="mt-7 max-w-[480px] text-base leading-7 text-muted">
              {description}
            </Typography>
            {showScene && (
              <Box className="mt-8 max-w-[340px] border-l-2 border-[#4bd0e4] pl-4">
                <Typography className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4bd0e4]">
                  {captureDeviceHeading}
                </Typography>
                <Typography className="mt-2 text-sm font-medium leading-6 text-ink">
                  {captureDeviceName}
                </Typography>
              </Box>
            )}
          </Box>

          <Box className="mt-12 md:mt-16">
            {showScene && (
              <>
                <Box
                  className="flex flex-wrap gap-2 pb-1"
                  role="group"
                  aria-label={heading}
                >
                  <button
                    type="button"
                    aria-pressed={mode === 'in-place'}
                    onClick={() => setMode('in-place')}
                    className={`min-h-11 shrink-0 whitespace-nowrap border px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
                      mode === 'in-place'
                        ? 'border-[#4bd0e4] bg-[#4bd0e4] text-[#071013]'
                        : 'border-line text-muted hover:border-[#4bd0e4] hover:text-ink'
                    }`}
                  >
                    {inPlaceLabel}
                  </button>
                  <button
                    type="button"
                    aria-pressed={mode === 'root-motion'}
                    onClick={() => setMode('root-motion')}
                    className={`min-h-11 shrink-0 whitespace-nowrap border px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
                      mode === 'root-motion'
                        ? 'border-[#4bd0e4] bg-[#4bd0e4] text-[#071013]'
                        : 'border-line text-muted hover:border-[#4bd0e4] hover:text-ink'
                    }`}
                  >
                    {rootMotionLabel}
                  </button>
                  <button
                    type="button"
                    aria-pressed={!playing}
                    onClick={() => setPlaying((current) => !current)}
                    className="min-h-11 shrink-0 whitespace-nowrap border border-line px-3 py-2 text-sm font-semibold text-muted transition-colors duration-300 hover:border-[#4bd0e4] hover:text-ink"
                  >
                    {playing ? pauseLabel : playLabel}
                  </button>
                </Box>
                <Typography className="mt-5 text-xs leading-5 text-faint">
                  {sourceLabel}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Box className="relative min-h-[560px] bg-[#0a0f13] md:col-span-8 md:min-h-full">
          <SceneErrorBoundary fallback={<StageFallback alt={fallbackAlt} />}>
            {showScene ? (
              <Suspense fallback={<StageFallback alt={fallbackAlt} />}>
                <MotionCaptureCanvas
                  mode={mode}
                  playing={playing}
                  reducedMotion={prefersReducedMotion}
                  loadingLabel={loadingLabel}
                  interactionLabel={interactionLabel}
                />
              </Suspense>
            ) : (
              <StageFallback alt={fallbackAlt} />
            )}
          </SceneErrorBoundary>
          {showScene && (
            <Typography className="pointer-events-none absolute right-5 top-5 max-w-[220px] text-right text-xs leading-5 text-white/55 md:right-7 md:top-7">
              {interactionLabel}
            </Typography>
          )}
          <Box className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#080b0e]/75 to-transparent" />
        </Box>
      </Box>
    </Box>
  );
}
