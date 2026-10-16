import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';
import { findProduct, type Product } from '@/content/productCatalog';
import {
  PartnerStrip,
  ProductContact,
  ProductImage,
  ProductLink,
} from '@/components/products/ProductElements';
import './products.css';
import './product-detail.css';

type WorkflowStep = { title: string; description: string };

function ProductDetail({ product }: { product: Product }) {
  const { t } = useTranslation();
  const location = useLocation();
  const returnTo = location.state?.catalogReturn ?? { pathname: '/product' };
  const name =
    product.family === 'platform'
      ? t('product_catalog.platform.name')
      : product.name;
  const steps = t(`product_detail.workflows.${product.family}`, {
    returnObjects: true,
  }) as WorkflowStep[];
  const gallery = product.media.filter((m) => m.src !== product.hero.src);
  const brochure = product.brochure;

  useEffect(() => {
    if (!location.hash) return;
    const frame = requestAnimationFrame(() =>
      document
        .getElementById(decodeURIComponent(location.hash.slice(1)))
        ?.scrollIntoView({ behavior: 'instant' }),
    );
    return () => cancelAnimationFrame(frame);
  }, [location.hash]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${name} | ZeroLab`;
    return () => {
      document.title = previousTitle;
    };
  }, [name]);

  return (
    <div
      className={`products-page product-detail product-detail--${product.family}`}
    >
      <nav
        className="product-breadcrumb product-wrap"
        aria-label={t('product_detail.breadcrumb')}
      >
        <Link
          to={returnTo}
          state={{ restoreCatalog: true, catalogScrollY: returnTo.scrollY }}
        >
          <ArrowBackIcon aria-hidden="true" />
          {t('common.back_to_products')}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{name}</span>
      </nav>
      <section
        className="product-detail-hero product-wrap"
        aria-labelledby="product-title"
      >
        <div className="product-detail-hero__copy">
          <p className="product-kicker">
            {t(`product_catalog.families.${product.family}.name`)}
          </p>
          <h1 id="product-title">{name}</h1>
          <p className="product-detail-hero__type">{t(product.titleKey)}</p>
          <p className="product-detail-hero__intro">
            {t(product.introduction[0])}
          </p>
          <div className="product-actions">
            <Link
              to="/contact"
              className="product-button product-button--primary"
            >
              {t('product_catalog.contact.action')}
              <ArrowForwardIcon aria-hidden="true" />
            </Link>
            {product.tables.length > 0 ||
            product.specificationKeys.length > 0 ? (
              <Link
                className="product-text-link"
                to={{ pathname: location.pathname, hash: '#specifications' }}
              >
                {t('product_detail.specifications')}
              </Link>
            ) : (
              <Link
                className="product-text-link"
                to={{ pathname: location.pathname, hash: '#capabilities' }}
              >
                {t('product_detail.capabilities')}
              </Link>
            )}
          </div>
        </div>
        <figure
          className={`product-detail-hero__stage${product.sceneHero ? ' product-detail-hero__stage--scene' : ''}`}
        >
          <ProductImage media={product.hero} eager />
          <figcaption>
            {product.sceneHero
              ? t(
                  product.family === 'platform'
                    ? 'product_detail.platform_image'
                    : 'product_detail.scene_image',
                )
              : name}
          </figcaption>
        </figure>
      </section>
      {product.advantages.length > 0 && (
        <section
          id="capabilities"
          className="product-capabilities product-wrap"
          aria-labelledby="capabilities-title"
        >
          <div className="product-section-heading">
            <h2 id="capabilities-title">{t('product_detail.capabilities')}</h2>
            {product.introduction.slice(1).map((key) => (
              <p key={key}>{t(key)}</p>
            ))}
          </div>
          <div className="product-features">
            {product.advantages.map((feature) => (
              <article key={feature.titleKey}>
                <span className="product-feature-mark" aria-hidden="true" />
                <h3>{t(feature.titleKey)}</h3>
                {feature.descriptionKeys.map((key) => (
                  <p key={key}>{t(key)}</p>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}
      <section
        id="workflow"
        className="product-workflow product-wrap"
        aria-labelledby="workflow-title"
      >
        <div className="product-section-heading">
          <h2 id="workflow-title">
            {t(`product_detail.workflow_titles.${product.family}`)}
          </h2>
        </div>
        <ol className="product-workflow__steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="product-workflow__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
        {gallery.length > 0 && (
          <div className="product-gallery">
            {gallery.map((media) => (
              <figure key={media.src}>
                <ProductImage media={media} />
                <figcaption>{t(media.altKey)}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
      {product.features.map((feature) => (
        <section
          className="product-wrap product-chip-features"
          key={feature.titleKey}
        >
          <h2>{t(feature.titleKey)}</h2>
          <ul>
            {feature.keys.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </section>
      ))}
      {product.scenarios.length > 0 && (
        <section
          className="product-scenarios product-wrap"
          aria-labelledby="scenarios-title"
        >
          <div className="product-section-heading">
            <h2 id="scenarios-title">{t('product_detail.scenarios')}</h2>
          </div>
          <div className="product-scenarios__grid">
            {product.scenarios.map((scenario) => (
              <article key={scenario.titleKey}>
                {scenario.media.map((media) => (
                  <ProductImage key={media.src} media={media} />
                ))}
                <h3>{t(scenario.titleKey)}</h3>
                {scenario.descriptionKeys.map((key) => (
                  <p key={key}>{t(key)}</p>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}
      {product.logos.length > 0 && (
        <section
          className="product-compatibility product-wrap"
          aria-labelledby="compatibility-title"
        >
          <h2 id="compatibility-title">{t('product_detail.compatibility')}</h2>
          <ul>
            {product.logos.map((media) => (
              <li key={media.src}>
                <ProductImage media={media} />
                <span>{t(media.altKey).replace(/ logo$/i, '')}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {(product.tables.length > 0 ||
        product.specificationKeys.length > 0 ||
        brochure) && (
        <section
          id="specifications"
          className="product-specifications product-wrap"
          aria-labelledby="specifications-title"
        >
          <div className="product-section-heading">
            <h2 id="specifications-title">
              {t('product_detail.specifications')}
            </h2>
            <p>{t('product_detail.specifications_note')}</p>
          </div>
          {product.tables.map((table, index) => (
            <div
              className="product-table-wrap"
              key={`${table.titleKey}-${index}`}
              role="region"
              aria-label={t(table.titleKey)}
              tabIndex={0}
            >
              <table>
                <caption>{t(table.titleKey)}</caption>
                <thead>
                  <tr>
                    {table.rows[0].map((cell, i) => (
                      <th key={i} scope="col">
                        {cell ? t(cell) : t('product_detail.parameter')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.slice(1).map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) =>
                        j === 0 ? (
                          <th key={j} scope="row">
                            {cell ? t(cell) : ''}
                          </th>
                        ) : (
                          <td key={j}>{cell ? t(cell) : ''}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {product.specificationKeys.length > 0 && (
            <ul className="product-specification-list">
              {product.specificationKeys.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          )}
          {brochure && (
            <a
              className="product-button"
              href={brochure.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(brochure.label)}
              <DownloadIcon aria-hidden="true" />
            </a>
          )}
        </section>
      )}
      {product.family === 'platform' && <PartnerStrip />}
      <section
        className="product-related product-wrap"
        aria-labelledby="related-title"
      >
        <div className="product-section-heading">
          <h2 id="related-title">{t('product_detail.related')}</h2>
          <Link
            className="product-text-link"
            to={returnTo}
            state={{ restoreCatalog: true, catalogScrollY: returnTo.scrollY }}
          >
            {t('common.back_to_products')}
            <ArrowForwardIcon aria-hidden="true" />
          </Link>
        </div>
        <div className="product-related__grid">
          {product.related.map((slug) => {
            const related = findProduct(slug)!;
            return (
              <article key={slug}>
                <Link
                  className="product-related__image"
                  to={`/product/${slug}`}
                  state={location.state}
                >
                  <ProductImage media={related.hero} />
                </Link>
                <ProductLink product={related} compact />
              </article>
            );
          })}
        </div>
      </section>
      <ProductContact />
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug = '' } = useParams();
  const { t } = useTranslation();
  const product = findProduct(slug);
  if (!product)
    return (
      <div className="products-page">
        <section className="product-not-found product-wrap">
          <p className="product-kicker">404</p>
          <h1>{t('product_detail.not_found.title')}</h1>
          <p>{t('product_detail.not_found.description')}</p>
          <Link
            className="product-button product-button--primary"
            to="/product"
          >
            {t('common.back_to_products')}
            <ArrowForwardIcon aria-hidden="true" />
          </Link>
        </section>
      </div>
    );
  return <ProductDetail key={product.slug} product={product} />;
}
