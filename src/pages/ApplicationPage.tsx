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
        inPlaceLabel={t('application.capture_lab.in_place_label')}
        rootMotionLabel={t('application.capture_lab.root_motion_label')}
        playLabel={t('application.capture_lab.play_label')}
        pauseLabel={t('application.capture_lab.pause_label')}
        loadingLabel={t('application.capture_lab.loading_label')}
        fallbackAlt={t('application.capture_lab.fallback_alt')}
        sourceLabel={t('application.capture_lab.source_label')}
        captureDeviceHeading={t(
          'application.capture_lab.capture_device_heading',
        )}
        captureDeviceName={t('application.capture_lab.capture_device_name')}
        interactionLabel={t('application.capture_lab.interaction_label')}
      />

      <Box component="section" className="px-6 py-28 md:px-[6vw] md:py-40">
        <Box className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:[grid-auto-rows:1fr]">
          {items.map((item, index) => (
            <SectionReveal
              component="article"
              key={item.title}
              className="h-full"
            >
              <Box className="group flex h-full flex-col overflow-hidden bg-panel">
                <Box className="aspect-[4/3] shrink-0 overflow-hidden bg-[#d7d9d8]">
                  <Box
                    component="img"
                    src={appImages[index]}
                    alt={item.title}
                    loading="lazy"
                    className={`h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      index === 0
                        ? 'object-contain'
                        : 'object-cover group-hover:scale-[1.025]'
                    }`}
                  />
                </Box>
                <Box className="flex flex-1 flex-col px-6 py-7 md:px-8 md:py-9">
                  <Typography
                    component="h2"
                    sx={{
                      fontSize: 'clamp(26px, 2.6vw, 38px)',
                      fontWeight: 600,
                      lineHeight: 1.08,
                      letterSpacing: '-0.035em',
                    }}
                    className="min-h-[2.2em]"
                  >
                    {item.title}
                  </Typography>
                  <Typography className="mt-5 text-sm leading-7 text-muted">
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            </SectionReveal>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
