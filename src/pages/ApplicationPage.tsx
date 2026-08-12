import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SectionReveal from '@/components/SectionReveal';
import SubHeader from '@/components/SubHeader';
import MotionCaptureSection from '@/components/MotionCaptureSection';

const appImages = [
  '/images/Teleoperation 2.png',
  '/images/The virtual studio.jpg',
  '/images/Sports.png',
  '/images/Gaming.png',
  '/images/Virtual live.jpg',
  '/images/Rehabilitation training.jpg',
];

const layouts = [
  'md:col-span-7',
  'md:col-span-5',
  'md:col-span-4',
  'md:col-span-8',
  'md:col-span-6',
  'md:col-span-6',
];

export default function ApplicationPage() {
  const { t } = useTranslation();
  const items = t('application.items', { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  return (
    <Box component="main" className="overflow-x-clip bg-page text-ink">
      <SubHeader
        title={t('application.title')}
        subtitle={t('application.intro')}
      />

      <MotionCaptureSection
        heading={t('application.capture_lab.heading')}
        description={t('application.capture_lab.description')}
        captureLabel={t('application.capture_lab.capture_label')}
        surfaceLabel={t('application.capture_lab.surface_label')}
        playLabel={t('application.capture_lab.play_label')}
        pauseLabel={t('application.capture_lab.pause_label')}
        loadingLabel={t('application.capture_lab.loading_label')}
        fallbackAlt={t('application.capture_lab.fallback_alt')}
        sourceLabel={t('application.capture_lab.source_label')}
        interactionLabel={t('application.capture_lab.interaction_label')}
      />

      <Box component="section" className="px-6 py-28 md:px-[6vw] md:py-40">
        <Box className="mx-auto grid max-w-[1280px] grid-cols-1 gap-x-8 gap-y-24 md:grid-cols-12">
          {items.map((item, index) => (
            <SectionReveal
              component="article"
              key={item.title}
              className={layouts[index]}
            >
              <Box className="group overflow-hidden bg-panel">
                <Box
                  component="img"
                  src={appImages[index]}
                  alt={item.title}
                  className={`w-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    index === 0
                      ? 'bg-[#d7d9d8] object-contain'
                      : 'object-cover group-hover:scale-[1.025]'
                  } ${
                    index === 0 || index === 3
                      ? 'aspect-[16/10]'
                      : 'aspect-[4/3]'
                  }`}
                />
              </Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: 'clamp(28px, 3vw, 44px)',
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: '-0.035em',
                }}
                className="!mt-4 md:!mt-6"
              >
                {item.title}
              </Typography>
              <Typography className="mt-5 max-w-[680px] text-sm leading-7 text-muted">
                {item.description}
              </Typography>
            </SectionReveal>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
