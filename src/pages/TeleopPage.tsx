import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SectionReveal from '@/components/SectionReveal';
import SubHeader from '@/components/SubHeader';
import VideoCard from '@/components/VideoCard';

const teleopVideoSrcs = [
  '/videos/openarmz_teleop.mp4',
  '/videos/如影随形.mp4',
  '/videos/如影随形2.mp4',
  '/videos/全身动捕控制睿尔曼类人形机器人.mp4',
  '/videos/亚欧博览会单臂.mp4',
];

export default function TeleopPage() {
  const { t } = useTranslation();
  const items = t('teleop.items', { returnObjects: true }) as {
    title: string;
    description: string;
  }[];
  const proofItems = t('teleop.proof.items', { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  return (
    <Box component="main" className="overflow-x-clip bg-page text-ink">
      <SubHeader
        title={t('teleop.title')}
        subtitle={`${t('teleop.subtitle_line1')} ${t('teleop.subtitle_line2')}`}
        backgroundImage="/images/teleoperation.png"
      />

      <Box
        component="section"
        className="relative overflow-hidden px-6 py-28 md:px-[6vw] md:py-40"
        sx={{
          background:
            'radial-gradient(circle at 88% 18%, rgba(75, 208, 228, 0.12), transparent 32%)',
        }}
      >
        <SectionReveal className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
          <Box className="md:col-span-5 md:pr-12">
            <Typography className="mb-6 text-xs font-semibold tracking-[0.2em] text-[#4bd0e4]">
              {t('teleop.proof.eyebrow')}
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: 'clamp(38px, 4.7vw, 70px)',
                fontWeight: 600,
                lineHeight: 0.98,
                letterSpacing: '-0.05em',
              }}
            >
              {t('teleop.proof.title')}
            </Typography>
            <Typography className="mt-8 max-w-[520px] text-base leading-8 text-muted">
              {t('teleop.proof.description')}
            </Typography>
          </Box>
          <Box className="md:col-span-7 md:pt-12">
            {proofItems.map((item, index) => (
              <Box
                key={item.title}
                className="group grid grid-cols-[48px_1fr] gap-5 border-t border-line py-7 transition-colors duration-300 last:border-b hover:border-[#4bd0e4]/55 md:grid-cols-[64px_0.8fr_1.2fr] md:items-baseline md:gap-7"
              >
                <Typography className="font-mono text-xs tabular-nums text-[#4bd0e4]">
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography
                  component="h3"
                  className="text-lg font-semibold tracking-[-0.02em] text-ink"
                >
                  {item.title}
                </Typography>
                <Typography className="heading-copy--inline col-start-2 mt-2 text-sm leading-7 text-muted md:col-start-3 md:mt-0">
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </SectionReveal>
      </Box>

      <Box component="section" className="px-6 py-28 md:px-[6vw] md:py-40">
        <SectionReveal className="mx-auto grid max-w-[1280px] grid-cols-1 gap-14 md:grid-cols-12 md:items-center">
          <Box className="md:col-span-4">
            <Typography
              component="h2"
              sx={{
                fontSize: 'clamp(38px, 4.5vw, 68px)',
                fontWeight: 600,
                lineHeight: 0.98,
                letterSpacing: '-0.05em',
              }}
            >
              {t('teleop.cycle_title')}
            </Typography>
            <Typography className="mt-6 text-base leading-7 text-muted">
              {t('teleop.cycle_description')}
            </Typography>
          </Box>
          <Box className="overflow-hidden bg-[#f2f4f4] p-5 md:col-span-8 md:p-8">
            <Box
              component="img"
              src="/images/whole cycle.png"
              alt={t('teleop.banner_alt')}
              className="w-full object-contain"
            />
          </Box>
        </SectionReveal>
      </Box>

      <Box
        component="section"
        className="bg-section px-6 py-28 md:px-[6vw] md:py-40"
      >
        <Box className="mx-auto max-w-[1280px]">
          <VideoCard
            title={items[0].title}
            description={items[0].description}
            videoSrc={teleopVideoSrcs[0]}
            featured
          />
          <Box className="mt-28 grid grid-cols-1 gap-x-8 gap-y-24 md:grid-cols-2">
            {items.slice(1).map((item, index) => (
              <Box
                key={item.title}
                className={index % 2 === 1 ? 'md:pt-24' : ''}
              >
                <VideoCard
                  title={item.title}
                  description={item.description}
                  videoSrc={teleopVideoSrcs[index + 1]}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
