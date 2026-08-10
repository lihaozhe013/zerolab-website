import { ArrowForward } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <Box component="main" className="overflow-hidden bg-white text-[#101211]">
      <Box className="relative isolate mx-auto h-[clamp(420px,46vw,600px)] w-full overflow-visible max-md:h-[58vw] max-md:min-h-[360px]">
        <Box
          component="img"
          src="/images/AboutImage.JPG"
          alt={t('about.collab_alt')}
          className="pointer-events-none absolute inset-0 z-[-1] h-full w-full object-cover opacity-90"
          sx={{
            objectPosition: 'center 15%',
            maskImage: 'linear-gradient(to bottom, black 0%, black 68%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 68%, transparent 100%)',
          }}
        />
        <Typography
          component="h1"
          className="absolute inset-x-0 bottom-[-24%] z-10 px-6 text-center font-medium text-[#3f4442]"
          sx={{
            fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}
        >
          {t('about.eyebrow')}
        </Typography>
      </Box>

      <Box className="mx-auto w-[min(840px,calc(100%-48px))] pb-24 pt-44 max-md:w-[calc(100%-32px)] max-md:pb-16 max-md:pt-28">
        <Typography
          className="font-normal text-[#3f4442]"
          sx={{
            fontSize: 'clamp(1.1rem, 1.55vw, 1.35rem)',
            lineHeight: 1.6,
          }}
        >
          {t('about.description')}
        </Typography>
        <Link to="/contact" className="mt-9 inline-block">
          <Button
            variant="text"
            endIcon={<ArrowForward />}
            className="p-0 text-sm font-semibold text-[#101211] normal-case hover:bg-transparent hover:text-[#08b4ce]"
          >
            {t('about.careers_cta')}
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
