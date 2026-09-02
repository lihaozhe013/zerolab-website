import { ArrowForward } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SubHeader from '@/components/SubHeader';

const productImages = [
  '/images/OpenArm.png',
  '/images/Teleop.png',
  '/images/F2Pro+.png',
  '/images/Data_gloves.png',
  '/images/Motion_Tracker.png',
];

const productLinks = [
  '/teleop',
  '/document/如影随形-汉语版20260309.pdf',
  '/document/F-2Brochure.pdf',
  '/document/DataGloves Brochure.pdf',
  '/document/Chip_brochure.pdf',
];

export default function ProductPage() {
  const { t } = useTranslation();
  const products = t('product.items', { returnObjects: true }) as {
    eyebrow?: string;
    title: string;
    description: string;
    link_text?: string;
  }[];

  return (
    <Box component="main" className="overflow-x-clip bg-page text-ink">
      <SubHeader
        title={t('product.page_title')}
        subtitle={t('product.intro')}
      />

      <Box
        component="section"
        className="mx-auto w-[min(1280px,calc(100%-64px))] pb-28 pt-20 max-md:w-[calc(100%-32px)] max-md:pb-20 max-md:pt-12"
      >
        {products.map((product, index) => {
          const link = productLinks[index];
          const linkLabel =
            product.link_text || t('common.view_product_details');
          const isDocument = link.startsWith('/document/');

          return (
            <Box
              component="article"
              key={product.title}
              className="grid grid-cols-1 items-center gap-10 border-t border-line py-16 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-2 md:gap-x-16"
            >
              <Box className="overflow-hidden bg-panel">
                <Box
                  component="img"
                  src={productImages[index]}
                  alt={product.title}
                  className="block max-h-[440px] w-full object-contain transition-transform duration-700 ease-out hover:scale-[1.025]"
                />
              </Box>

              <Box>
                {product.eyebrow && (
                  <Typography className="mb-5 text-xs font-semibold tracking-[0.18em] text-[#4bd0e4]">
                    {product.eyebrow}
                  </Typography>
                )}
                <Typography
                  component="h2"
                  sx={{
                    fontSize: 'clamp(30px, 3.4vw, 52px)',
                    fontWeight: 600,
                    lineHeight: 0.98,
                    letterSpacing: '-0.05em',
                  }}
                >
                  {product.title}
                </Typography>
                <Typography className="mt-7 max-w-[560px] text-sm leading-7 text-muted">
                  {product.description}
                </Typography>

                {isDocument ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-10 inline-flex min-h-12 items-center gap-3 border border-[#08b4ce] px-5 py-3 text-sm font-semibold text-[#08b4ce] transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#08b4ce] hover:text-[#071013] active:scale-[0.98]"
                  >
                    {linkLabel}
                    <ArrowForward fontSize="small" />
                  </a>
                ) : (
                  <Link
                    to={link}
                    className="mt-10 inline-flex min-h-12 items-center gap-3 border border-[#08b4ce] px-5 py-3 text-sm font-semibold text-[#08b4ce] transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#08b4ce] hover:text-[#071013] active:scale-[0.98]"
                  >
                    {linkLabel}
                    <ArrowForward fontSize="small" />
                  </Link>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
