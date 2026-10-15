import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ContactInfo() {
  const { t } = useTranslation();
  const items = [
    {
      title: t('contact.address_title'),
      lines: [t('contact.address_subtitle')],
    },
    {
      title: t('contact.phone'),
      lines: [t('contact.phone_number'), t('contact.hours')],
      href: 'tel:+862155809628',
    },
    {
      title: t('contact.email'),
      lines: [t('contact.email_prompt')],
      href: `mailto:${t('contact.email_prompt')}`,
    },
  ];

  return (
    <Box component="dl" className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <Box
          key={item.title}
          className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-5 lg:grid-cols-[88px_minmax(0,1fr)] lg:gap-4"
        >
          <Typography
            component="dt"
            className="text-sm font-medium leading-7 text-muted"
          >
            {item.title}
          </Typography>
          <Box component="dd" className="min-w-0 space-y-1">
            {item.lines.map((line, index) =>
              index === 0 && item.href ? (
                <Box
                  component="a"
                  key={line}
                  href={item.href}
                  className="inline-flex min-h-7 max-w-full items-center break-all text-base leading-7 text-ink underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  {line}
                </Box>
              ) : (
                <Typography
                  key={line}
                  className={
                    index === 0
                      ? 'text-base leading-7 text-ink'
                      : 'text-sm leading-6 text-muted'
                  }
                >
                  {line}
                </Typography>
              ),
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
