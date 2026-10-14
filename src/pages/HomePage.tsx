import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import heroMotionTransfer from '@/assets/hero-motion-transfer.webp';
import MotionSignalVisual from '@/components/MotionSignalVisual';
import './home.css';

gsap.registerPlugin(ScrollTrigger);

type StoryItem = {
  verb: string;
  title: string;
  description: string;
};

export default function HomePage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const storyItems = t('home.story.items', {
    returnObjects: true,
  }) as StoryItem[];

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const image = hero?.querySelector<HTMLElement>('.home-hero__image');
    const veil = hero?.querySelector<HTMLElement>('.home-hero__veil');
    const copy = hero?.querySelector<HTMLElement>('.home-hero__copy');
    const description = hero?.querySelector<HTMLElement>(
      '.home-hero__description',
    );
    if (!hero || !image || !veil || !copy || !description) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(image, { opacity: 0.64 }, { opacity: 1 }, 0)
        .fromTo(veil, { opacity: 0.78 }, { opacity: 0.18 }, 0)
        .fromTo(
          copy,
          {
            y: 0,
            scale: 1,
            transformOrigin: 'left center',
          },
          {
            y: () => (window.innerWidth < 600 ? -24 : -40),
            scale: () => (window.innerWidth < 600 ? 1.025 : 1.05),
            duration: 0.75,
            ease: 'power1.out',
          },
          0,
        )
        .fromTo(
          description,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power1.out' },
          0.15,
        )
        .fromTo(hero, { '--hero-progress': 0 }, { '--hero-progress': 1 }, 0);

      return () => timeline.kill();
    });

    return () => media.revert();
  }, []);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.fromTo(
        story,
        { '--rail-progress': 0 },
        {
          '--rail-progress': 1,
          ease: 'none',
          scrollTrigger: {
            trigger: story,
            start: 'top 78%',
            end: 'bottom 38%',
            scrub: 0.4,
          },
        },
      );
      return () => tween.kill();
    });

    return () => media.revert();
  }, []);

  return (
    <div className="home">
      <section ref={heroRef} className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__stage">
          <img
            className="home-hero__image"
            src={heroMotionTransfer}
            alt=""
            aria-hidden="true"
          />
          <div className="home-hero__veil" aria-hidden="true" />
          <div className="home-hero__inner">
            <div className="home-hero__copy">
              <p className="home-hero__signature">ZeroLab</p>
              <h1 id="home-title">{t('home.hero.title')}</h1>
              <p className="home-hero__description">
                {t('home.hero.description_p1')}
              </p>
              <button
                className="home-hero__scroll"
                type="button"
                onClick={() =>
                  storyRef.current?.scrollIntoView({
                    behavior: window.matchMedia(
                      '(prefers-reduced-motion: reduce)',
                    ).matches
                      ? 'auto'
                      : 'smooth',
                  })
                }
              >
                <span className="home-hero__scroll-line" aria-hidden="true" />
                {t('home.hero.scroll_label')}
              </button>
            </div>
          </div>
          <div className="home-hero__baseline" aria-hidden="true">
            <span />
            <span />
          </div>
        </div>
      </section>

      <section
        id="motion-story"
        ref={storyRef}
        className="home-story"
        aria-labelledby="home-story-title"
      >
        <div className="home-story__intro">
          <div className="home-story__intro-copy">
            <h2 id="home-story-title">{t('home.story.title')}</h2>
            <p>{t('home.story.subtitle')}</p>
          </div>
          <MotionSignalVisual />
        </div>
        <div className="home-story__stages">
          <div className="home-story__rail" aria-hidden="true">
            <span className="home-story__progress" />
          </div>
          {storyItems.map((item) => (
            <article className="home-story__stage" key={item.verb}>
              <span className="home-story__node" aria-hidden="true" />
              <p className="home-story__verb">{item.verb}</p>
              <h3>{item.title}</h3>
              <p className="home-story__description">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-outro" aria-labelledby="home-outro-title">
        <svg
          className="home-outro__signal"
          viewBox="0 0 1440 700"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path d="M-90 522C132 532 157 302 338 306C522 310 518 620 720 542C905 470 868 112 1072 144C1228 170 1279 364 1538 224" />
          <path d="M-90 556C132 566 157 336 338 340C522 344 518 654 720 576C905 504 868 146 1072 178C1228 204 1279 398 1538 258" />
          <path d="M-90 590C132 600 157 370 338 374C522 378 518 688 720 610C905 538 868 180 1072 212C1228 238 1279 432 1538 292" />
        </svg>
        <div className="home-outro__content">
          <h2 id="home-outro-title">{t('home.cta.title')}</h2>
          <div className="home-outro__links">
            <Link to="/product">{t('home.cta.product_label')}</Link>
            <Link to="/application">{t('home.cta.application_label')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
