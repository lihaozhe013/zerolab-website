import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const partnerSrcs = [
  '/images/partner1.png',
  '/images/partner19.png',
  '/images/partner7.png',
  '/images/partner3.png',
  '/images/partner13.png',
  '/images/partner8.png',
  '/images/partner14.png',
  '/images/partner2.png',
  '/images/partner4.png',
  '/images/partner5.png',
  '/images/partner6.png',
  '/images/partner16.png',
  '/images/partner18.png',
  '/images/partner9.png',
  '/images/partner10.png',
  '/images/partner11.png',
  '/images/partner12.png',
  '/images/partner15.png',
  '/images/partner17.png',
];

export default function PartnerCarousel() {
  const { t } = useTranslation();
  const partnerNames = t('partners.names', { returnObjects: true }) as string[];

  return (
    <Box component="section" className="overflow-hidden bg-[#07090c] py-20 text-white md:py-24">
      <Box className="mx-auto mb-12 flex w-[min(1280px,calc(100%-48px))] items-end justify-between md:w-[min(1280px,calc(100%-12vw))]">
        <Typography component="h2" className="text-sm font-medium text-white/45">
          {t('partners.title')}
        </Typography>
        <Box className="h-px flex-1 bg-white/10 ml-8" />
      </Box>

      <Box className="partner-marquee-mask">
        <Box className="partner-marquee-track">
          {[0, 1].map((groupIndex) => (
            <Box key={groupIndex} className="partner-marquee-group" aria-hidden={groupIndex === 1}>
              {partnerSrcs.map((src, index) => (
                <Box
                  key={`${groupIndex}-${src}`}
                  component="img"
                  src={src}
                  alt={groupIndex === 1 ? '' : partnerNames[index] || ''}
                  className="h-14 w-36 flex-none object-contain opacity-45 grayscale transition-[filter,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-90 md:h-16 md:w-44"
                  sx={{ filter: 'grayscale(1) invert(1)', mixBlendMode: 'screen' }}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
