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

  return (
    <Box component="main" className="overflow-x-clip bg-[#07090c] text-white">
      <SubHeader
        title={t('teleop.title')}
        subtitle={`${t('teleop.subtitle_line1')} ${t('teleop.subtitle_line2')}`}
        backgroundImage="/images/teleoperation.png"
      />

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
            <Typography className="mt-6 text-base leading-7 text-white/55">
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

      <Box component="section" className="bg-[#0a0c0f] px-6 py-28 md:px-[6vw] md:py-40">
        <Box className="mx-auto max-w-[1280px]">
          <VideoCard
            title={items[0].title}
            description={items[0].description}
            videoSrc={teleopVideoSrcs[0]}
            featured
          />
          <Box className="mt-28 grid grid-cols-1 gap-x-8 gap-y-24 md:grid-cols-2">
            {items.slice(1).map((item, index) => (
              <Box key={item.title} className={index % 2 === 1 ? 'md:pt-24' : ''}>
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
