import { ArrowForward } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const products = t('product.items', { returnObjects: true }) as { title: string }[];

  const footerGroups = [
    {
      title: t('nav.product'),
      links: [
        { label: products[0].title, to: '/teleop' },
        { label: products[1].title, to: '/document/F-1彩页.pdf', external: true },
        { label: products[2].title, to: '/document/H-1彩页.pdf', external: true },
        { label: products[3].title, to: '/document/ZL9NSQ单页-0604.pdf', external: true },
      ],
    },
    {
      title: t('nav.application'),
      links: [
        { label: t('application.title'), to: '/application' },
        { label: t('nav.solution'), to: '/solution' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { label: t('nav.about'), to: '/about' },
        { label: t('nav.contact'), to: '/contact' },
      ],
    },
  ];

  return (
    <Box component="footer" className="w-full border-t border-white/10 bg-[#575a69] text-white">
      <Box className="mx-auto grid w-[min(1280px,calc(100%-64px))] grid-cols-12 gap-x-0 gap-y-16 pb-20 pt-12 max-md:w-[calc(100%-32px)] max-md:pb-14 max-md:pt-10 lg:gap-x-10">
        <Box className="col-span-12 min-w-0 w-full max-w-full lg:col-span-5">
          <Box
            component="img"
            src="/images/LOGO1.png"
            alt="ZeroLab"
            className="block h-auto w-[170px]"
          />

          <Typography className="mt-8 whitespace-nowrap text-sm leading-7 text-white/65 max-sm:whitespace-normal">
            {t('footer.address')}
          </Typography>
          <Box className="mt-5 space-y-1 text-sm text-white/75">
            <Typography component="a" href="tel:+862155809628" className="block text-sm">
              {t('footer.phone')}
            </Typography>
            <Typography component="a" href="mailto:info@zero-lab.tech" className="block text-sm">
              info@zero-lab.tech
            </Typography>
          </Box>

          <Box className="mt-8 flex items-end gap-6 max-sm:items-start">
            <Box
              component="img"
              src="/images/Wechat Accounts.jpg"
              alt={t('footer.wechat_alt')}
              className="h-[112px] w-[112px] bg-white object-contain p-1"
            />
            <Box>
              <Typography className="mb-4 max-w-[180px] text-xs leading-5 text-white/50">
                {t('footer.wechat_prompt')}
              </Typography>
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center gap-3 border border-[#4bd0e4] bg-[#4bd0e4] px-5 py-3 text-sm font-semibold text-[#071013] transition-colors hover:bg-transparent hover:text-[#4bd0e4]"
              >
                {t('common.contact_us')}
                <ArrowForward fontSize="small" />
              </Link>
            </Box>
          </Box>
        </Box>

        <Box className="col-span-12 grid min-w-0 w-full max-w-full grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:col-span-7 lg:col-start-7 lg:grid-cols-3 lg:pt-12">
          {footerGroups.map((group) => (
            <Box key={group.title} className="min-w-0">
              <Typography
                component="h2"
                className="border-b border-white/15 pb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/50"
              >
                {group.title}
              </Typography>
              <Box className="mt-5 flex flex-col gap-4">
                {group.links.map((link) =>
                  link.external ? (
                    <a
                      key={`${group.title}-${link.to}-${link.label}`}
                      href={link.to}
                      target="_blank"
                      rel="noreferrer"
                      className="break-words text-sm leading-6 text-white/85 transition-colors hover:text-[#4bd0e4]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={`${group.title}-${link.to}-${link.label}`}
                      to={link.to}
                      className="break-words text-sm leading-6 text-white/85 transition-colors hover:text-[#4bd0e4]"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box className="border-t border-white/10">
        <Box className="mx-auto flex w-[min(1280px,calc(100%-64px))] items-center justify-between gap-4 py-6 text-xs text-white/40 max-md:w-[calc(100%-32px)] max-sm:flex-col max-sm:items-start">
          <Typography className="text-xs text-inherit">
            © {new Date().getFullYear()} ZeroLab. {t('footer.rights')}
          </Typography>
          <Typography className="text-xs text-inherit">{t('footer.icp')}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
