import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import contactHeroImage from '@/assets/contact-hero.jpg';
import ContactInfo from '@/components/ContactInfo';

export default function ContactHero() {
  const { t } = useTranslation();

  return (
    <Box
      component="header"
      className="px-6 pb-12 pt-28 md:px-[6vw] md:pb-20 md:pt-36"
    >
      <Box className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16">
        <Box className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <Typography
            component="h1"
            sx={{
              fontSize: 'clamp(44px, 5.4vw, 80px)',
              fontWeight: 650,
              letterSpacing: '-0.055em',
            }}
            className="text-balance"
          >
            {t('contact.title')}
          </Typography>
          <Typography className="heading-copy--compact max-w-[440px] text-base leading-7 text-muted">
            {t('contact.intro')}
          </Typography>
        </Box>

        <Box className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <Box
            component="img"
            src={contactHeroImage}
            alt={`${t('contact.map_marker')} — ${t('contact.address_subtitle')}`}
            width={1280}
            height={960}
            fetchPriority="high"
            className="block h-auto w-full"
          />
        </Box>

        <Box className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <ContactInfo />
        </Box>
      </Box>
    </Box>
  );
}
