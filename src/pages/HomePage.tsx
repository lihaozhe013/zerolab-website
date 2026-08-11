import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import HeroKineticCopy from '@/components/HeroKineticCopy';
import ProductScrollShowcase, {
  type ProductShowcaseItem,
} from '@/components/ProductScrollShowcase';
import SectionRouteSync from '@/components/SectionRouteSync';
import AboutPage from '@/pages/AboutPage';
import ApplicationPage from '@/pages/ApplicationPage';
import ContactPage from '@/pages/ContactPage';
import DownloadsPage from '@/pages/DownloadsPage';
import SolutionPage from '@/pages/SolutionPage';

const productImages = [
  '/images/OpenArm.png',
  '/images/Teleop.png',
  '/images/F2Pro+.png',
  '/images/Data_gloves.png',
  '/images/Motion_Tracker.png',
];

const productDestinations = [
  '/teleop',
  '/document/如影随形-汉语版20260309.pdf',
  '/document/F-2Brochure.pdf',
  '/document/DataGloves Brochure.pdf',
  '/document/Chip_brochure.pdf',
];

export default function HomePage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const productItems = t('product.items', { returnObjects: true }) as {
    title: string;
    description: string;
    link_text?: string;
  }[];
  const productShowcaseItems: ProductShowcaseItem[] = productItems.map(
    (product, index) => ({
      title: product.title,
      description: product.description,
      image: productImages[index],
      href: productDestinations[index],
      linkText: product.link_text || t('common.view_product_details'),
    }),
  );

  return (
    <Box className="overflow-x-clip bg-page text-ink">
      <SectionRouteSync />
      <Box
        ref={heroRef}
        component="section"
        className="relative h-[260dvh] w-full bg-[#050505] motion-reduce:h-auto motion-reduce:min-h-[100dvh]"
      >
        <Box className="sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-[#050505] motion-reduce:relative">
          <Box
            component="video"
            data-hero-media
            src="/videos/ZeroLabVid.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-0"
          />
          <Box className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/42 to-black/18" />
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
                state={{ scrollToSection: true }}
                className="inline-flex min-h-12 items-center border border-white/55 px-6 py-3 text-sm font-semibold text-white transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#4bd0e4] hover:bg-[#4bd0e4] hover:text-[#071013] active:scale-[0.98]"
              >
                {t('common.explore_products')}
              </Link>
            </HeroKineticCopy>
          </Box>
        </Box>
      </Box>

      <Box id="product" component="section" className="scroll-mt-20">
        <ProductScrollShowcase items={productShowcaseItems} />
      </Box>
      <Box id="application" component="section" className="scroll-mt-20">
        <ApplicationPage />
      </Box>
      <Box id="solution" component="section" className="scroll-mt-20">
        <SolutionPage />
      </Box>
      <Box id="downloads" component="section" className="scroll-mt-20">
        <DownloadsPage />
      </Box>
      <Box id="about" component="section" className="scroll-mt-20">
        <AboutPage />
      </Box>
      <Box id="contact" component="section" className="scroll-mt-20">
        <ContactPage />
      </Box>
    </Box>
  );
}
