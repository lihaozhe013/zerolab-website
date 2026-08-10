import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PartnerCarousel from '@/components/PartnerCarousel';
import ApplicationCard from '@/components/ApplicationCard';

const productImages = [
  '/images/openarmz.jpg',
  '/images/主图6.png',
  '/images/主图4.png',
  '/images/主图5.png',
];

const appImages = [
  '/images/MixedReality.png',
  '/images/Teleoperation 2.png',
  '/images/Sports.png',
];

const envImages = ['/images/reception.png', '/images/Lab.JPG', '/images/Datacenter.JPG'];

export default function HomePage() {
  const { t } = useTranslation();
  const productItems = t('home.products.items', { returnObjects: true }) as {
    title: string;
    description: string;
  }[];
  const appItems = t('home.applications.items', { returnObjects: true }) as { title: string }[];
  const envItems = t('home.environments.items', { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  return (
    <>
      {/* Hero Section */}
      <Box className="relative min-h-screen w-full overflow-hidden bg-[#04091e]">
        <Box
          component="video"
          src="/videos/ZeroLabVid.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <Box className="absolute inset-0 bg-gradient-to-r from-[#04091e]/90 via-[#04091e]/65 to-[#04091e]/30" />
        <Box className="relative z-10 min-h-screen flex items-end text-left text-white px-[8%] pb-[13vh] pt-[160px] max-md:px-6 max-md:pb-[11vh]">
          <Box className="max-w-[820px]">
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '44px', md: 'clamp(58px, 5.5vw, 88px)' },
                mb: { xs: 3, md: 4 },
                fontWeight: 700,
                letterSpacing: '-0.045em',
                lineHeight: 0.98,
                whiteSpace: 'pre-line',
              }}
            >
              {t('home.hero.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 2, fontSize: { xs: '18px', md: '24px' }, fontWeight: 500 }}
              className="max-w-[620px] leading-snug"
            >
              {t('home.hero.description_p1')}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 5, fontSize: { xs: '15px', md: '17px' } }}
              className="max-w-[590px] leading-relaxed text-white/75"
            >
              {t('home.hero.description_p2')}
            </Typography>
            <Link to="/product">
              <Button
                variant="outlined"
                className="text-white border-white/70 px-7 py-2.5 text-[13px] font-semibold hover:border-[#08b4ce] hover:bg-[#08b4ce] transition-all duration-300 normal-case"
              >
                {t('common.explore_products')}
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Partners Section */}
      <PartnerCarousel />

      {/* Products Section */}
      <Box className="w-[80%] mx-auto pt-[100px] text-center max-md:w-[90%]">
        <Box className="mb-4 text-center">
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2 }}>
            {t('home.products.title')}
          </Typography>
          <Box sx={{ width: 60, height: 3, bgcolor: '#08b4ce', mx: 'auto', borderRadius: 2 }} />
        </Box>
        <Typography
          sx={{
            fontSize: { xs: 14, md: 15 },
            lineHeight: 1.8,
            lineBreak: 'strict',
          }}
          className="mb-10 w-full text-[#777]"
        >
          {t('home.products.subtitle')}
        </Typography>
        <Box className="grid grid-cols-2 gap-x-3 gap-y-[51px] max-md:grid-cols-1">
          {productItems.map((product, i) => (
            <Box key={i} className="flex flex-col rounded-[10px] bg-[#dbdbdb] px-3 py-5">
              <Typography variant="h6" sx={{ mb: 2 }} className="font-semibold">
                {product.title}
              </Typography>
              <Box
                component="img"
                src={productImages[i]}
                alt={product.title}
                className="h-[400px] w-full object-cover max-md:h-[280px]"
              />
              <Typography className="flex-1 px-2.5 py-2.5 text-sm font-light leading-[22px] text-[#777]">
                {product.description}
              </Typography>
              <Link to="/product" className="self-center">
                <Button
                  variant="outlined"
                  className="border-[#08b4ce] px-[34px] py-3 text-[13px] font-normal text-[#08b4ce] transition-colors duration-300 hover:bg-[#08b4ce] hover:text-white normal-case"
                >
                  {t('common.view_products')}
                </Button>
              </Link>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Applications Section */}
      <Box className="w-[80%] mx-auto text-center pt-[50px] max-md:w-[90%]">
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          {t('home.applications.title')}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 10 }}
          className="text-[#777] leading-relaxed text-left"
        >
          {t('home.applications.subtitle')}
        </Typography>
        <Box className="flex flex-wrap justify-between gap-5 max-md:flex-col">
          {appItems.map((app, i) => (
            <ApplicationCard key={i} title={app.title} image={appImages[i]} />
          ))}
        </Box>
      </Box>

      {/* Environment Section */}
      <Box className="w-[80%] mx-auto text-center pt-[60px] max-md:w-[90%]">
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          {t('home.environments.title')}
        </Typography>
        <Box className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
          {envItems.map((env, i) => (
            <Box key={i} className="flex flex-col rounded-xl overflow-hidden bg-white">
              <Box className="relative overflow-hidden">
                <Box
                  component="img"
                  src={envImages[i]}
                  alt={env.title}
                  className="w-full h-[240px] object-cover transition-transform duration-700 hover:scale-110 max-md:h-[200px]"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </Box>
              <Box className="p-5 flex flex-col flex-1 text-left">
                <Typography variant="h6" sx={{ mb: 2 }} className="font-semibold">
                  {env.title}
                </Typography>
                <Typography variant="body2" className="text-[#777] leading-relaxed text-sm flex-1">
                  {env.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
