import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ProductScrollShowcase, {
  type ProductShowcaseItem,
} from '@/components/ProductScrollShowcase';
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

export default function ProductPage() {
  const { t } = useTranslation();
  const products = t('product.items', { returnObjects: true }) as {
    title: string;
    description: string;
    link_text?: string;
  }[];
  const showcaseItems: ProductShowcaseItem[] = products.map((product, index) => ({
    title: product.title,
    description: product.description,
    image: productImages[index],
    href: productLinks[index],
    linkText: product.link_text || t('common.view_product_details'),
  }));

  return (
    <Box component="main" className="overflow-x-clip bg-[#07090c] text-white">
      <SubHeader title={t('product.page_title')} subtitle={t('product.intro')} />
      <ProductScrollShowcase items={showcaseItems} />
    </Box>
  );
}
