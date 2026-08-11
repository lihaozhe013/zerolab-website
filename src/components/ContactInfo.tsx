import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SectionReveal from '@/components/SectionReveal';

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
    },
    { title: t('contact.email'), lines: [t('contact.email_prompt')] },
  ];

  return (
    <Box className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-12">
      {items.map((item, index) => (
        <SectionReveal
          component="article"
          key={item.title}
          className={index === 0 ? 'md:col-span-6' : 'md:col-span-3'}
        >
          <Box className="h-px w-full bg-line" />
          <Typography className="mt-6 text-sm font-semibold text-[#4bd0e4]">
            {item.title}
          </Typography>
          <Box className="mt-7 space-y-2">
            {item.lines.map((line) => (
              <Typography key={line} className="text-base leading-7 text-muted">
                {line}
              </Typography>
            ))}
          </Box>
        </SectionReveal>
      ))}
    </Box>
  );
}
