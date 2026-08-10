import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SubHeader from '@/components/SubHeader';
import VideoCard from '@/components/VideoCard';

const solutionVideoSrcs = ['/videos/zl9nsq.mp4', '/videos/taiji.mp4', '/videos/h1.mp4'];

export default function SolutionPage() {
  const { t } = useTranslation();
  const items = t('solution.items', { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  return (
    <Box component="main" className="overflow-x-clip bg-[#07090c] text-white">
      <SubHeader
        title={t('solution.title')}
        subtitle={t('solution.intro')}
      />

      <Box component="section" className="px-6 py-28 md:px-[6vw] md:py-40">
        <Box className="mx-auto max-w-[1280px]">
          <VideoCard
            title={items[0].title}
            description={items[0].description}
            videoSrc={solutionVideoSrcs[0]}
            featured
          />
          <Box className="mt-28 grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
            {items.slice(1).map((item, index) => (
              <Box key={item.title} className={index === 0 ? 'md:col-span-7' : 'md:col-span-5 md:pt-28'}>
                <VideoCard
                  title={item.title}
                  description={item.description}
                  videoSrc={solutionVideoSrcs[index + 1]}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
