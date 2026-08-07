import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const partnerSrcs = [
  '/images/partner1.png',
  '/images/partner19.png',
  '/images/partner7.png',
  '/images/partner3.png',
  '/images/partner13.png',
  '/images/partner8.png',
  '/images/partner14.png',
  '/images/partner2.png',
  '/images/partner4.png',
  '/images/partner5.png',
  '/images/partner6.png',
  '/images/partner16.png',
  '/images/partner18.png',
  '/images/partner9.png',
  '/images/partner10.png',
  '/images/partner11.png',
  '/images/partner12.png',
  '/images/partner15.png',
  '/images/partner17.png',
];

const ITEM_WIDTH = 290;
const ITEM_WIDTH_MOBILE = 205;

export default function PartnerCarousel() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const [paused, setPaused] = useState(false);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const buttonAnimationFrameRef = useRef<number | null>(null);
  const dragStartRef = useRef<{ x: number; offset: number } | null>(null);
  const partnerNames = t('partners.names', { returnObjects: true }) as string[];
  const w = isMobile ? ITEM_WIDTH_MOBILE : ITEM_WIDTH;
  const loopWidth = partnerSrcs.length * w;

  const setTrackPosition = useCallback((offset: number) => {
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${offset}px)`;
  }, []);

  const moveTrack = useCallback(
    (distance: number) => {
      let nextOffset = offsetRef.current + distance;
      nextOffset %= loopWidth;
      if (nextOffset < 0) nextOffset += loopWidth;
      offsetRef.current = nextOffset;
      setTrackPosition(nextOffset);
    },
    [loopWidth, setTrackPosition],
  );

  const slideByButton = useCallback(
    (distance: number) => {
      if (buttonAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(buttonAnimationFrameRef.current);
      }

      let startOffset = offsetRef.current;
      // Use the duplicated half of the track when moving left from the first card,
      // so the slide stays visually continuous at the loop seam.
      if (distance < 0 && startOffset + distance < 0) startOffset += loopWidth;
      const targetOffset = startOffset + distance;
      const startedAt = performance.now();
      const duration = 620;

      setIsButtonAnimating(true);
      setTrackPosition(startOffset);

      const animate = (timestamp: number) => {
        const progress = Math.min((timestamp - startedAt) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        const currentOffset = startOffset + (targetOffset - startOffset) * easedProgress;
        setTrackPosition(currentOffset);

        if (progress < 1) {
          buttonAnimationFrameRef.current = window.requestAnimationFrame(animate);
          return;
        }

        offsetRef.current = targetOffset % loopWidth;
        if (offsetRef.current < 0) offsetRef.current += loopWidth;
        setTrackPosition(offsetRef.current);
        buttonAnimationFrameRef.current = null;
        setIsButtonAnimating(false);
      };

      buttonAnimationFrameRef.current = window.requestAnimationFrame(animate);
    },
    [loopWidth, setTrackPosition],
  );

  const nextOne = useCallback(() => slideByButton(w), [slideByButton, w]);
  const prevOne = useCallback(() => slideByButton(-w), [slideByButton, w]);

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (buttonAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(buttonAnimationFrameRef.current);
      buttonAnimationFrameRef.current = null;
      setIsButtonAnimating(false);
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = { x: event.clientX, offset: offsetRef.current };
    setIsDragging(true);
  };

  const dragTrack = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragStart = dragStartRef.current;
    if (!dragStart) return;

    const dragDistance = dragStart.x - event.clientX;
    let nextOffset = dragStart.offset + dragDistance;
    // The second copy of the cards makes crossing either edge feel continuous.
    if (nextOffset < 0) nextOffset += loopWidth;
    setTrackPosition(nextOffset);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const dragDistance = dragStartRef.current.x - event.clientX;
    let nextOffset = dragStartRef.current.offset + dragDistance;
    nextOffset %= loopWidth;
    if (nextOffset < 0) nextOffset += loopWidth;
    offsetRef.current = nextOffset;
    setTrackPosition(nextOffset);
    dragStartRef.current = null;
    setIsDragging(false);
  };

  useEffect(() => {
    offsetRef.current = 0;
    setTrackPosition(0);
  }, [setTrackPosition, w]);

  useEffect(() => {
    if (paused || isButtonAnimating || isDragging) return;

    let previousTimestamp: number | null = null;
    const animate = (timestamp: number) => {
      if (previousTimestamp !== null) {
        // 32 pixels per second keeps the motion smooth while making the loop more lively.
        moveTrack(((timestamp - previousTimestamp) / 1000) * 32);
      }
      previousTimestamp = timestamp;
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isButtonAnimating, isDragging, moveTrack, paused]);

  useEffect(
    () => () => {
      if (buttonAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(buttonAnimationFrameRef.current);
      }
    },
    [],
  );

  return (
    <Box sx={{ pb: 4 }} className="w-[80%] mx-auto text-center pt-[60px] max-md:w-[95%]">
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }} className="text-[#222]">
        {t('partners.title')}
      </Typography>

      <Box
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Box
          className="overflow-hidden"
          onPointerDown={startDrag}
          onPointerMove={dragTrack}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          sx={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'pan-y', userSelect: 'none' }}
        >
          <Box
            ref={trackRef}
            sx={{
              display: 'flex',
              willChange: 'transform',
            }}
          >
            {[...partnerSrcs, ...partnerSrcs].map((src, i) => {
              const partnerIndex = i % partnerSrcs.length;
              const isDuplicate = i >= partnerSrcs.length;
              return (
              <Box
                key={`${src}-${i}`}
                className="flex-none text-center bg-white rounded-2xl p-[30px] transition-all duration-500 hover:-translate-y-1 border border-gray-200 hover:border-[#08b4ce]"
                sx={{ width: w - 40, mx: 2.5 }}
              >
                <Box
                  component="img"
                  src={src}
                  alt={isDuplicate ? '' : partnerNames[partnerIndex] || ''}
                  className="w-[200px] h-[200px] object-contain rounded bg-transparent max-md:w-[140px] max-md:h-[140px]"
                />
              </Box>
              );
            })}
          </Box>
        </Box>

        <IconButton
          onClick={prevOne}
          sx={{
            position: 'absolute',
            left: { xs: -16, md: -24 },
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'white',
            boxShadow: 3,
            '&:hover': { bgcolor: '#f0f0f0' },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton
          onClick={nextOne}
          sx={{
            position: 'absolute',
            right: { xs: -16, md: -24 },
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'white',
            boxShadow: 3,
            '&:hover': { bgcolor: '#f0f0f0' },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
