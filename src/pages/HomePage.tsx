import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import HeroKineticCopy from '@/components/HeroKineticCopy';
import ApplicationSceneSelector from '@/components/ApplicationSceneSelector';
import ProductScrollShowcase, {
  type ProductShowcaseItem,
} from '@/components/ProductScrollShowcase';

const productImages = [
  '/images/openarmz.jpg',
  '/images/LigntTrackerInertia20221020.png',
  '/images/DataGloves.png',
  '/images/Motion Tracker.jpg',
];

const productDestinations = [
  '/teleop',
  '/document/F-1彩页.pdf',
  '/document/H-1彩页.pdf',
  '/document/ZL9NSQ单页-0604.pdf',
];

const appImages = ['/images/MixedReality.png', '/images/Teleoperation 2.png', '/images/Sports.png'];

const envImages = ['/images/reception.png', '/images/Lab.JPG', '/images/Datacenter.JPG'];

export default function HomePage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const productItems = t('product.items', { returnObjects: true }) as {
    title: string;
    description: string;
    link_text?: string;
  }[];
  const appItems = t('home.applications.items', { returnObjects: true }) as {
    title: string;
    description: string;
  }[];
  const envItems = t('home.environments.items', { returnObjects: true }) as {
    title: string;
    description: string;
  }[];
  const productShowcaseItems: ProductShowcaseItem[] = productItems.map((product, index) => ({
    title: product.title,
    description: product.description,
    image: productImages[index],
    href: productDestinations[index],
    linkText: product.link_text || t('common.view_product_details'),
  }));

  return (
    <Box className="overflow-x-clip bg-[#07090c] text-white">
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
                sx={{ mb: 4, fontSize: { xs: '17px', md: '22px' }, fontWeight: 500 }}
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

      <ProductScrollShowcase items={productShowcaseItems} />

      <ApplicationSceneSelector
        title={t('home.applications.title')}
        subtitle={t('home.applications.subtitle')}
        exploreLabel={t('home.applications.explore_label')}
        items={appItems.map((item, index) => ({ ...item, image: appImages[index] }))}
      />

      <Box component="section" className="bg-[#07090c] px-6 py-28 md:px-[6vw] md:py-40">
        <Box className="mx-auto max-w-[1280px]">
          <Typography
            component="h2"
            sx={{
              fontSize: 'clamp(42px, 5vw, 76px)',
              fontWeight: 600,
              lineHeight: 0.96,
              letterSpacing: '-0.05em',
            }}
            className="text-[clamp(42px,5vw,76px)] font-semibold leading-[0.96] tracking-[-0.05em]"
          >
            {t('home.environments.title')}
          </Typography>

          <Box className="mt-20 grid grid-cols-1 gap-x-7 gap-y-16 md:grid-cols-12">
            {envItems.map((environment, index) => {
              const layout = index === 0 ? 'md:col-span-7 md:row-span-2' : 'md:col-span-5';
              const mediaHeight = index === 0 ? 'md:h-[720px]' : 'md:h-[320px]';

              return (
                <Box component="article" key={environment.title} className={layout}>
                  <Box className={`overflow-hidden bg-[#101318] ${mediaHeight}`}>
                    <Box
                      component="img"
                      src={envImages[index]}
                      alt={environment.title}
                      className="aspect-[4/3] h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.025]"
                    />
                  </Box>
                  <Typography
                    component="h3"
                    sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 600, letterSpacing: '-0.02em' }}
                    className="mt-5 text-xl font-semibold tracking-[-0.02em] md:text-2xl"
                  >
                    {environment.title}
                  </Typography>
                  <Typography className="mt-3 max-w-[620px] text-sm leading-6 text-white/45">
                    {environment.description}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Box component="section" className="bg-[#0a0c0f] px-6 py-32 md:px-[6vw] md:py-48">
        <Box className="mx-auto max-w-[1280px]">
          <Typography
            component="h2"
            sx={{
              fontSize: 'clamp(48px, 7vw, 104px)',
              fontWeight: 600,
              lineHeight: 0.92,
              letterSpacing: '-0.06em',
            }}
            className="max-w-[980px] text-[clamp(48px,7vw,104px)] font-semibold leading-[0.92] tracking-[-0.06em]"
          >
            {t('home.cta.title')}
          </Typography>
          <Typography className="mt-8 max-w-[600px] text-base leading-7 text-white/50">
            {t('home.cta.description')}
          </Typography>
          <Link
            to="/contact"
            className="mt-12 inline-flex min-h-14 items-center bg-[#4bd0e4] px-7 py-4 text-sm font-semibold text-[#071013] transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white active:scale-[0.98]"
          >
            {t('common.contact_us')}
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
