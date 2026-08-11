import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SectionReveal from '@/components/SectionReveal';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <Box component="main" className="overflow-x-clip bg-page text-ink">
      <Box
        component="header"
        className="grid min-h-[78dvh] grid-cols-1 bg-deep pt-20 md:grid-cols-12"
      >
        <Box className="flex items-end px-6 pb-14 pt-20 md:col-span-5 md:px-[6vw] md:pb-20 md:pt-24">
          <Box>
            <Typography className="mb-6 text-sm font-semibold text-[#4bd0e4]">
              {t('about.eyebrow')}
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: 'clamp(44px, 5vw, 76px)',
                fontWeight: 650,
                lineHeight: 0.94,
                letterSpacing: '-0.055em',
              }}
              className="max-w-[650px] text-balance"
            >
              {t('about.headline')}
            </Typography>
          </Box>
        </Box>

        <Box className="flex items-center justify-center bg-panel md:col-span-7">
          <Box
            component="img"
            src="/images/AboutImage.JPG"
            alt={t('about.collab_alt')}
            className="block h-auto max-h-[calc(78dvh-5rem)] w-full object-contain object-center"
          />
        </Box>
      </Box>

      <Box component="section" className="px-6 py-28 md:px-[6vw] md:py-40">
        <Box className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
          <SectionReveal className="md:col-span-5">
            <Typography
              component="h2"
              sx={{
                fontSize: 'clamp(40px, 5vw, 72px)',
                fontWeight: 600,
                lineHeight: 0.96,
                letterSpacing: '-0.05em',
              }}
            >
              {t('about.title')}
            </Typography>
          </SectionReveal>
          <SectionReveal className="md:col-span-6 md:col-start-7 md:pt-10">
            <Typography className="text-base leading-8 text-muted md:text-lg">
              {t('about.description')}
            </Typography>
            <Link
              to="/contact"
              className="mt-10 inline-flex min-h-12 items-center border border-[#4bd0e4] px-6 py-3 text-sm font-semibold text-[#4bd0e4] transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#4bd0e4] hover:text-[#071013] active:scale-[0.98]"
            >
              {t('about.careers_cta')}
            </Link>
          </SectionReveal>
        </Box>
      </Box>
    </Box>
  );
}
