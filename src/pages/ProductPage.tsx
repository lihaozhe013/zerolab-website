import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  findProduct,
  legacyProductPath,
  productFamilies,
  products,
  productPath,
} from '@/content/productCatalog';
import {
  CatalogProductLink,
  PartnerStrip,
  ProductContact,
  ProductImage,
  ProductLink,
} from '@/components/products/ProductElements';
import './products.css';

function ProductCatalog() {
  const { t } = useTranslation();
  const [active, setActive] = useState<string>('robotics');
  const robot = findProduct('openarm-z')!;
  const platform = findProduct('motion-data-platform')!;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${t('nav.product')} | ZeroLab`;
    const update = () => {
      const current = productFamilies
        .filter(
          (family) =>
            (document.getElementById(family.id)?.getBoundingClientRect().top ??
              Infinity) <= 190,
        )
        .at(-1);
      setActive(current?.id ?? 'robotics');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      document.title = previousTitle;
    };
  }, [t]);

  return (
    <div className="products-page">
      <section
        className="product-hero product-wrap"
        aria-labelledby="products-title"
      >
        <div className="product-hero__copy">
          <p className="product-kicker">{t('product_catalog.label')}</p>
          <h1 id="products-title">{t('product_catalog.title')}</h1>
          <p className="product-hero__description">
            {t('product_catalog.description')}
          </p>
          <div className="product-actions">
            <Link
              className="product-button product-button--primary"
              to={{ pathname: '/product', hash: '#robotics' }}
            >
              {t('product_catalog.explore')}
              <ArrowForwardIcon aria-hidden="true" />
            </Link>
            <Link className="product-text-link" to="/contact">
              {t('product_catalog.contact.action')}
            </Link>
          </div>
          <div className="product-hero__scope">
            <span>{t('product_catalog.scope.hardware')}</span>
            <span>{t('product_catalog.scope.integration')}</span>
          </div>
        </div>
        <div
          className="product-system"
          aria-label={t('product_catalog.system_label')}
        >
          <svg
            className="product-system__lines"
            viewBox="0 0 650 620"
            fill="none"
            aria-hidden="true"
          >
            <path d="M30 190H180L260 300H410M30 430H180L260 320H410" />
            <circle cx="260" cy="310" r="180" />
            <circle cx="260" cy="310" r="245" />
            <path d="M260 15V60M260 560V605M0 310H45M475 310H520" />
          </svg>
          <div className="product-system__robot">
            <ProductImage media={robot.hero} eager />
            <span>OpenArm-Z</span>
          </div>
          <div className="product-system__component product-system__component--hands">
            <ProductImage media={findProduct('h2-pro-plus')!.hero} eager />
            <span>{t('product_catalog.system.hands')}</span>
          </div>
          <div className="product-system__component product-system__component--tracker">
            <ProductImage
              media={findProduct('f2-pro-plus')!.media.find((m) =>
                m.src.endsWith('/f2-pro-plus-gloves.png'),
              )!}
              eager
            />
            <span>{t('product_catalog.system.body')}</span>
          </div>
          <div className="product-system__chip">
            <ProductImage media={findProduct('zl9nsq')!.hero} eager />
            <span>{t('product_catalog.system.silicon')}</span>
          </div>
          <span className="product-system__caption">
            {t('product_catalog.system.caption')}
          </span>
        </div>
      </section>
      <nav
        className="product-family-nav"
        aria-label={t('product_catalog.categories')}
      >
        <div className="product-wrap">
          {productFamilies.map((family) => (
            <Link
              key={family.id}
              to={{ pathname: '/product', hash: `#${family.id}` }}
              aria-current={active === family.id ? 'location' : undefined}
            >
              {t(`product_catalog.families.${family.id}.name`)}
              <span aria-hidden="true">
                {products
                  .filter((p) => p.family === family.id)
                  .length.toString()
                  .padStart(2, '0')}
              </span>
            </Link>
          ))}
        </div>
      </nav>
      <div className="product-exhibits">
        {productFamilies.map((family, index) => {
          const featured = findProduct(family.featured)!;
          return (
            <section
              id={family.id}
              key={family.id}
              className={`product-exhibit product-wrap${index % 2 ? ' product-exhibit--reverse' : ''}`}
              aria-labelledby={`${family.id}-title`}
            >
              <div className="product-exhibit__copy">
                <p className="product-kicker">
                  {t(`product_catalog.families.${family.id}.context`)}
                </p>
                <h2 id={`${family.id}-title`}>
                  {t(`product_catalog.families.${family.id}.name`)}
                </h2>
                <p className="product-exhibit__description">
                  {t(`product_catalog.families.${family.id}.description`)}
                </p>
                <div className="product-models">
                  {products
                    .filter((p) => p.family === family.id)
                    .map((p) => (
                      <ProductLink key={p.slug} product={p} />
                    ))}
                </div>
              </div>
              <div
                className={`product-exhibit__stage product-exhibit__stage--${family.id}`}
              >
                <span className="product-exhibit__watermark" aria-hidden="true">
                  {family.id === 'robotics'
                    ? 'OpenArm'
                    : family.id === 'body'
                      ? 'F2'
                      : family.id === 'hands'
                        ? 'H2'
                        : 'SiP'}
                </span>
                <ProductImage media={featured.hero} />
                <span className="product-exhibit__caption">
                  {featured.name}
                  <span>
                    {t(`product_catalog.families.${family.id}.context`)}
                  </span>
                </span>
              </div>
            </section>
          );
        })}
      </div>
      <section
        id="platform"
        className="product-platform product-wrap"
        aria-labelledby="platform-title"
      >
        <div className="product-platform__image">
          <ProductImage media={platform.hero} />
        </div>
        <div className="product-platform__copy">
          <p className="product-kicker">
            {t('product_catalog.platform.label')}
          </p>
          <h2 id="platform-title">{t('product_catalog.platform.title')}</h2>
          <p>{t('product_catalog.platform.description')}</p>
          <CatalogProductLink
            className="product-button"
            to={productPath(platform.slug)}
          >
            {t('product_catalog.platform.action')}
            <ArrowForwardIcon aria-hidden="true" />
          </CatalogProductLink>
        </div>
      </section>
      <PartnerStrip />
      <ProductContact />
    </div>
  );
}

export default function ProductPage() {
  const { hash } = useLocation();
  const legacyPath = legacyProductPath(decodeURIComponent(hash.slice(1)));
  if (legacyPath) return <Navigate to={legacyPath} replace />;
  if (hash === '#partners')
    return (
      <Navigate to={{ pathname: '/product', hash: '#ecosystem' }} replace />
    );
  return <ProductCatalog />;
}
