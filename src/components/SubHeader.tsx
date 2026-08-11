import { Box, Typography } from '@mui/material';
import { useThemeMode } from '@/ThemeModeProvider';

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
  const { mode } = useThemeMode();
  const isLight = mode === 'light';
  const hasLongTitle = title.length > 38;

  return (
    <Box
      component="header"
      className="relative isolate flex min-h-[72dvh] items-end overflow-hidden px-6 pb-16 pt-24 md:px-[6vw] md:pb-20"
      sx={{
        backgroundColor: isLight ? '#dce8eb' : '#050608',
        color: isLight ? '#10191c' : '#f2f8f9',
        transition:
          'background-color 300ms cubic-bezier(0.16, 1, 0.3, 1), color 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {backgroundImage && (
        <Box
          component="img"
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          sx={{
            filter: isLight
              ? 'saturate(0.72) contrast(0.74) brightness(1.18)'
              : 'none',
            opacity: isLight ? 0.55 : 1,
            transition:
              'filter 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      )}
      <Box
        className="absolute inset-0 -z-10"
        sx={{
          background: isLight
            ? 'linear-gradient(90deg, rgba(243,247,248,0.94) 0%, rgba(243,247,248,0.72) 58%, rgba(220,232,235,0.54) 100%)'
            : 'rgba(0, 0, 0, 0.3)',
        }}
      />

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
            textShadow: isLight
              ? '0 1px 18px rgba(255, 255, 255, 0.48)'
              : '0 2px 26px rgba(0, 0, 0, 0.62)',
          }}
          className="max-w-[1080px] text-balance"
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              color: isLight ? '#435257' : 'rgba(242, 248, 249, 0.88)',
              textShadow: isLight
                ? '0 1px 12px rgba(255, 255, 255, 0.44)'
                : '0 2px 18px rgba(0, 0, 0, 0.72)',
            }}
            className="mt-7 max-w-[620px] text-base leading-7 md:text-lg"
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
