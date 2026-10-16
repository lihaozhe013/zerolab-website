import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Link,
  useLocation,
  useNavigate,
  type LinkProps,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  partners,
  productPath,
  type Product,
  type ProductMedia,
} from '@/content/productCatalog';

export function ProductImage({
  media,
  eager = false,
  className = '',
}: {
  media: ProductMedia;
  eager?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <img
      className={className}
      src={media.src}
      alt={t(media.altKey)}
      width={media.width}
      height={media.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  );
}

export function CatalogProductLink({ to, children, ...props }: LinkProps) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Link
      {...props}
      to={to}
      state={location.state}
      onClick={(event) => {
        if (
          location.pathname !== '/product' ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        navigate(to, {
          state: {
            catalogReturn: {
              pathname: '/product',
              hash: location.hash,
              scrollY: window.scrollY,
            },
          },
        });
      }}
    >
      {children}
    </Link>
  );
}

export function ProductLink({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <CatalogProductLink
      className={`product-model${compact ? ' product-model--compact' : ''}`}
      to={productPath(product.slug)}
    >
      <span>
        <span className="product-model__name">
          {product.family === 'platform'
            ? t('product_catalog.platform.name')
            : product.name}
        </span>
        <span className="product-model__summary">
          {t(`product_catalog.models.${product.slug}`)}
        </span>
      </span>
      <span className="product-model__action">
        <span>{t('product_catalog.view')}</span>
        <ArrowOutwardIcon aria-hidden="true" />
      </span>
    </CatalogProductLink>
  );
}

export function PartnerStrip() {
  const { t } = useTranslation();
  return (
    <section
      id="ecosystem"
      className="product-ecosystem product-wrap"
      aria-labelledby="ecosystem-title"
    >
      <div className="product-section-heading">
        <h2 id="ecosystem-title">{t('product_catalog.ecosystem.title')}</h2>
        <p>{t('product_catalog.ecosystem.description')}</p>
      </div>
      <ul className="product-partners">
        {partners.map((partner) => (
          <li key={partner.nameKey}>
            <div>
              <img
                src={partner.src}
                alt={t(partner.altKey)}
                loading="lazy"
                width="180"
                height="72"
              />
            </div>
            <span>{t(partner.nameKey)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProductContact() {
  const { t } = useTranslation();
  return (
    <section className="product-contact product-wrap">
      <div>
        <h2>{t('product_catalog.contact.title')}</h2>
        <p>{t('product_catalog.contact.description')}</p>
      </div>
      <Link className="product-button product-button--primary" to="/contact">
        {t('product_catalog.contact.action')}
        <ArrowForwardIcon aria-hidden="true" />
      </Link>
    </section>
  );
}
