import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import heroMotionTransfer from '@/assets/hero-motion-transfer.webp';
import HeroKineticCopy from '@/components/HeroKineticCopy';

export default function HomePage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <Box className="overflow-x-clip bg-page text-ink">
      <Box
        ref={heroRef}
        component="section"
        className="relative h-[260dvh] w-full bg-[#050505] motion-reduce:h-auto motion-reduce:min-h-[100dvh]"
      >
        <Box className="sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-[#050505] motion-reduce:relative">
          <Box
            component="img"
            data-hero-media
            src={heroMotionTransfer}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.12]"
          />
          <Box className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/8 to-transparent" />
          <Box className="relative min-h-[100dvh] text-left text-white">
            <HeroKineticCopy heroRef={heroRef} title={t('home.hero.title')}>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  fontSize: { xs: '17px', md: '22px' },
                  fontWeight: 500,
                }}
                className="max-w-[610px] leading-snug"
              >
                {t('home.hero.description_p1')}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 5, fontSize: { xs: '14px', md: '16px' } }}
                className="max-w-[580px] leading-relaxed text-white/60"
              >
                {t('home.hero.description_p2')}
              </Typography>
              <Link
                to="/product"
                className="inline-flex min-h-12 items-center border border-white/55 px-6 py-3 text-sm font-semibold text-white transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#4bd0e4] hover:bg-[#4bd0e4] hover:text-[#071013] active:scale-[0.98]"
              >
                {t('common.explore_products')}
              </Link>
            </HeroKineticCopy>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
