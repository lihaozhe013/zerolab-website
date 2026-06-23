import { useCallback, useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoCardProps {
  title: string;
  description: string;
  videoSrc: string;
  linkTo?: string;
}

export default function VideoCard({
  title,
  description,
  videoSrc,
  linkTo = '/contact',
}: VideoCardProps) {
  const { t } = useTranslation();
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const disposePlayer = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }
  }, []);

  useEffect(() => {
    disposePlayer();

    const container = containerRef.current;
    if (!container) return;

    const videoEl = document.createElement('video');
    videoEl.className = 'video-js vjs-big-play-centered w-full h-full';
    videoEl.setAttribute('playsinline', '');
    container.appendChild(videoEl);

    const player = videojs(videoEl, {
      controls: true,
      autoplay: true,
      muted: true,
      sources: [{ src: videoSrc, type: 'video/mp4' }],
    });

    playerRef.current = player;

    return disposePlayer;
  }, [videoSrc, disposePlayer]);

  return (
    <Box className="mb-8">
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }} className="text-[#222]">
        {title}
      </Typography>
      <Box
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden bg-black"
        sx={{
          aspectRatio: '16/9',
          position: 'relative',
          '& .video-js': { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
        }}
      />
      <Typography variant="body2" sx={{ mt: 3, mb: 4 }} className="text-[#999] leading-relaxed">
        {description}
      </Typography>
      <Link to={linkTo} className="inline-block">
        <Button
          variant="outlined"
          className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
        >
          {t('common.learn_more')}
        </Button>
      </Link>
    </Box>
  );
}
