import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SouthRoundedIcon from '@mui/icons-material/SouthRounded';
import './about.css';

export default function AboutPage() {
  const { t } = useTranslation();
  const exploreCompany = () => {
    document.getElementById('about-company')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  };

  return (
    <div className="about-page">
      <header className="about-hero about-container">
        <div className="about-hero__masthead">
          <p>{t('about.eyebrow')}</p>
          <span>ZeroLab</span>
        </div>
        <div className="about-hero__grid">
          <div className="about-hero__copy">
            <h1>{t('about.headline')}</h1>
            <p className="about-hero__company">{t('about.company_name')}</p>
            <button
              className="about-explore"
              onClick={exploreCompany}
              type="button"
            >
              <span className="about-explore__icon">
                <SouthRoundedIcon aria-hidden="true" />
              </span>
              {t('about.story_label')}
            </button>
          </div>
          <figure className="about-hero__portrait">
            <img
              src="/images/AboutImage.JPG"
              alt={t('about.collab_alt')}
              fetchPriority="high"
              width="1600"
              height="900"
            />
            <figcaption>
              <span className="about-status" aria-hidden="true" />
              {t('about.company_name')}
            </figcaption>
          </figure>
        </div>
      </header>
      <section
        id="about-company"
        className="about-company about-container"
        aria-labelledby="about-company-title"
      >
        <div className="about-section-heading">
          <h2 id="about-company-title">{t('about.title')}</h2>
        </div>
        <div className="about-company__copy">
          <p>{t('about.description')}</p>
          <Link className="about-text-link" to="/application">
            {t('home.applications.explore_label')}
            <ArrowForwardRoundedIcon aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section
        className="about-environment about-container"
        aria-labelledby="about-environment-title"
      >
        <div className="about-environment__visual">
          <h2 id="about-environment-title">{t('home.environments.title')}</h2>
          <img
            src="/images/reception.png"
            alt={t('home.environments.items.0.title')}
            loading="lazy"
            width="1000"
            height="800"
          />
        </div>
        <div className="about-environment__details">
          {[0, 1, 2].map((index) => (
            <article key={index}>
              <h3>{t(`home.environments.items.${index}.title`)}</h3>
              <p>{t(`home.environments.items.${index}.description`)}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="about-contact" aria-labelledby="about-contact-title">
        <div className="about-container about-contact__inner">
          <div>
            <h2 id="about-contact-title">{t('home.cta.title')}</h2>
            <p>{t('contact.intro')}</p>
          </div>
          <Link className="about-contact__link" to="/contact">
            {t('about.careers_cta')}
            <ArrowForwardRoundedIcon aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
