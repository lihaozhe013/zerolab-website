import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SubHeader from '@/components/SubHeader';

const productImages = [
  '/images/openarmz.jpg',
  '/images/LigntTrackerInertia20221020.png',
  '/images/DataGloves.png',
  '/images/Motion Tracker.jpg',
];

const productLinks = [
  '/teleop',
  '/document/F-1彩页.pdf',
  '/document/H-1彩页.pdf',
  '/document/ZL9NSQ单页-0604.pdf',
];

const productLinkClass =
  'inline-flex items-center border border-[#08b4ce] px-[34px] py-3 text-[13px] font-normal text-[#08b4ce] transition-colors duration-300 hover:bg-[#08b4ce] hover:text-white';

export default function ProductPage() {
  const { t } = useTranslation();
  const items = t('product.items', { returnObjects: true }) as {
    title: string;
    description: string;
    link_text?: string;
  }[];

  return (
    <>
      <SubHeader title={t('product.page_title')} />

      <Box className="mx-auto w-[min(1280px,calc(100%-64px))] pb-20 pt-[110px] max-md:w-[calc(100%-32px)] max-md:py-12">
        {items.map((product, index) => {
          const link = productLinks[index];
          const linkLabel = product.link_text || t('common.view_product_details');
          const isDocument = link.startsWith('/document/');

          return (
            <Box
              component="section"
              key={product.title}
              className="grid grid-cols-2 items-start gap-x-9 py-[33px] first:pt-0 last:pb-0 max-md:grid-cols-1 max-md:gap-y-7 max-md:py-10"
            >
              <Box className="overflow-hidden bg-[#f2f4f4]">
                <Box
                  component="img"
                  src={productImages[index]}
                  alt={product.title}
                  className="block h-auto max-h-[440px] w-full object-contain transition-transform duration-700 ease-out hover:scale-[1.025]"
                />
              </Box>

              <Box>
                <Typography
                  component="h2"
                  className="font-bold text-[#111]"
                  sx={{
                    fontSize: { xs: '1.75rem', md: '33px' },
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}
                >
                  {index === 3 && product.title.includes('无线姿态') ? (
                    <>
                      {product.title.slice(0, product.title.indexOf('无线姿态'))}
                      <br />
                      {product.title.slice(product.title.indexOf('无线姿态'))}
                    </>
                  ) : (
                    product.title
                  )}
                </Typography>
                <Typography className="max-w-[560px] pb-[25px] pt-[15px] text-sm font-light leading-[22px] text-[#777]">
                  {product.description}
                </Typography>

                <Box>
                  {isDocument ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className={productLinkClass}
                    >
                      {linkLabel}
                    </a>
                  ) : (
                    <Link to={link} className={productLinkClass}>
                      {linkLabel}
                    </Link>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
