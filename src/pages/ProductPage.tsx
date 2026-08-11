import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ProductScrollShowcase, {
  type ProductShowcaseItem,
} from '@/components/ProductScrollShowcase';
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
  const showcaseItems: ProductShowcaseItem[] = products.map(
    (product, index) => ({
      eyebrow: product.eyebrow,
      title: product.title,
      description: product.description,
      image: productImages[index],
      href: productLinks[index],
      linkText: product.link_text || t('common.view_product_details'),
    }),
  );

  return (
    <Box component="main" className="overflow-x-clip bg-page text-ink">
      <SubHeader
        title={t('product.page_title')}
        subtitle={t('product.intro')}
      />
      <ProductScrollShowcase items={showcaseItems} />
    </Box>
  );
}
