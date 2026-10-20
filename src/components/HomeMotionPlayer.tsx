import { useMediaQuery } from '@mui/material';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MotionSignalVisual from './MotionSignalVisual';
import {
  SceneErrorBoundary,
  supportsWebGL,
} from './motion-capture/SceneSupport';

const MotionCaptureCanvas = lazy(() => import('./MotionCaptureCanvas'));

export default function HomeMotionPlayer() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [webGLAvailable] = useState(supportsWebGL);
  const [nearViewport, setNearViewport] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(!reducedMotion);

  useEffect(() => {
    if (reducedMotion) setPlaying(false);
  }, [reducedMotion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearViewport(true);
        preloadObserver.disconnect();
      },
      { rootMargin: '320px 0px' },
    );
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    preloadObserver.observe(container);
    visibilityObserver.observe(container);
    return () => {
      preloadObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  const fallback = <MotionSignalVisual />;
  const showScene = nearViewport && webGLAvailable;

  return (
    <div ref={containerRef} className="home-motion-player">
      <SceneErrorBoundary fallback={fallback}>
        {showScene ? (
          <>
            <Suspense fallback={fallback}>
              <MotionCaptureCanvas
                modelPath="/models/robot-y-taichi.glb"
                rootNodeName="Hips"
                mode="root-motion"
                cameraReset={0}
                playing={playing && visible}
                reducedMotion={reducedMotion}
                loadingLabel={t('application.capture_lab.loading_label')}
                interactionLabel={t('home.story.player_label')}
              />
            </Suspense>
            <p className="home-motion-player__hint">
              {t('home.story.player_interaction')}
            </p>
            <button
              type="button"
              className="home-motion-player__toggle"
              aria-pressed={!playing}
              onClick={() => setPlaying((current) => !current)}
            >
              {t(
                playing
                  ? 'application.capture_lab.pause_label'
                  : 'application.capture_lab.play_label',
              )}
            </button>
          </>
        ) : (
          fallback
        )}
      </SceneErrorBoundary>
    </div>
  );
}
