import { useTranslation } from 'react-i18next';
import { brochureContent } from './productBrochureContent';
import PageTableOfContents from './PageTableOfContents';

const chapters = brochureContent
  .filter((page) => !page.id.startsWith('brochure-page-'))
  .map((page) => {
    const model = page.blocks
      .flatMap((block) => block.children)
      .find((block) => block.type === 'text' && block.role === 'model');
    return {
      id: page.id,
      labelKey:
        model?.type === 'text'
          ? model.key
          : page.id === 'partners'
            ? 'product_brochure.products.ecosystem.partners.title'
            : 'product_brochure.navigation.platform',
    };
  });

export default function ProductTableOfContents() {
  const { t } = useTranslation();
  return (
    <PageTableOfContents
      chapters={chapters.map((chapter) => ({
        id: chapter.id,
        label: t(chapter.labelKey),
      }))}
      title={t('product_brochure.navigation.title')}
      pathname="/product"
      contentSelector=".product-brochure"
    />
  );
}
