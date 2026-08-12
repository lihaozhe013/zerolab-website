import { Box, Typography } from '@mui/material';
import SectionReveal from '@/components/SectionReveal';

interface VideoCardProps {
  title: string;
  description: string;
  videoSrc: string;
  featured?: boolean;
}

export default function VideoCard({
  title,
  description,
  videoSrc,
  featured = false,
}: VideoCardProps) {
  return (
    <SectionReveal component="article" className="group">
      <Box className="overflow-hidden bg-panel">
        <Box
          component="video"
          src={videoSrc}
          controls
          muted
          playsInline
          preload="metadata"
          className={`block w-full bg-black object-cover ${featured ? 'aspect-[16/8]' : 'aspect-video'}`}
        />
      </Box>
      <Typography
        component="h2"
        sx={{
          marginTop: { xs: '12px', md: '24px' },
          fontSize: featured
            ? 'clamp(30px, 4vw, 56px)'
            : 'clamp(24px, 2.5vw, 36px)',
          fontWeight: 600,
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
        }}
        className="max-w-[900px] text-ink"
      >
        {title}
      </Typography>
      <Typography className="mt-5 max-w-[760px] text-sm leading-7 text-muted">
        {description}
      </Typography>
    </SectionReveal>
  );
}
