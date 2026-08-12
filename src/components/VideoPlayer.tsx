import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  src: string;
  className?: string;
}

export default function VideoPlayer({ src, className = '' }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const videoElement = document.createElement('video');
    videoElement.className =
      'video-js vjs-big-play-centered zerolab-video-player';
    videoElement.setAttribute('playsinline', '');
    videoElement.setAttribute('preload', 'metadata');

    container.appendChild(videoElement);

    const player = videojs(videoElement, {
      controls: true,
      autoplay: false,
      fill: true,
      muted: true,
      preload: 'metadata',
      sources: [{ src, type: 'video/mp4' }],
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'pictureInPictureToggle',
          'fullscreenToggle',
        ],
      },
    });

    return () => {
      if (!player.isDisposed()) {
        player.dispose();
      }
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-black ${className}`}
    />
  );
}
