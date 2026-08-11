import { Box, Typography } from '@mui/material';

interface SubHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function SubHeader({
  title,
  subtitle,
  backgroundImage,
}: SubHeaderProps) {
  const hasLongTitle = title.length > 38;

  return (
    <Box
      component="header"
      className="relative isolate flex min-h-[72dvh] items-end overflow-hidden bg-[#050608] px-6 pb-16 pt-24 text-white md:px-[6vw] md:pb-20"
    >
      {backgroundImage && (
        <Box
          component="img"
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
      )}
      <Box className="absolute inset-0 -z-10 bg-black/30" />

      <Box className="mx-auto w-full max-w-[1280px]">
        <Typography
          component="h1"
          sx={{
            fontSize: hasLongTitle
              ? 'clamp(38px, 4.7vw, 70px)'
              : 'clamp(48px, 7.5vw, 112px)',
            fontWeight: 650,
            lineHeight: 0.9,
            letterSpacing: '-0.06em',
            textShadow: '0 2px 26px rgba(0, 0, 0, 0.62)',
          }}
          className="max-w-[1080px] text-balance"
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{ textShadow: '0 2px 18px rgba(0, 0, 0, 0.72)' }}
            className="mt-7 max-w-[620px] text-base leading-7 text-white/88 md:text-lg"
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
