import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageTableOfContents from '@/components/PageTableOfContents';
import SectionReveal from '@/components/SectionReveal';
import SubHeader from '@/components/SubHeader';

type GroupKind = 'software' | 'developer' | 'integration';

interface SoftwareGroup {
  id: string;
  kind: GroupKind;
  title: string;
  description: string;
  items: Array<{
    title: string;
    description: string;
  }>;
}

const groupIcons = {
  software: ComputerOutlinedIcon,
  developer: TerminalOutlinedIcon,
  integration: ExtensionOutlinedIcon,
};

export default function DownloadsPage() {
  const { t } = useTranslation();
  const groups = t('downloads.groups', {
    returnObjects: true,
  }) as SoftwareGroup[];
  return (
    <Box component="main" className="overflow-x-clip bg-page text-ink">
      <PageTableOfContents
        chapters={groups.map((group) => ({ id: group.id, label: group.title }))}
        title={t('downloads.contents')}
        pathname="/downloads"
        contentSelector=".software-directory"
      />
      <SubHeader title={t('downloads.title')} subtitle={t('downloads.intro')} />

      <Box component="section" className="px-6 py-20 md:px-[6vw] md:py-28">
        <Box className="software-directory mx-auto max-w-[1040px] space-y-20">
          {groups.map((group) => {
            const GroupIcon = groupIcons[group.kind];

            return (
              <SectionReveal
                component="section"
                id={group.id}
                key={group.id}
                className="scroll-mt-28"
              >
                <Box className="mb-3 border-b border-line pb-7">
                  <Box className="flex items-center gap-4 md:gap-5">
                    <Box className="flex size-10 shrink-0 items-center justify-center text-accent md:size-12">
                      <GroupIcon
                        aria-hidden="true"
                        sx={{ fontSize: { xs: 28, md: 32 } }}
                      />
                    </Box>
                    <Typography
                      component="h2"
                      sx={{
                        fontSize: 'clamp(30px, 3.7vw, 52px)',
                        fontWeight: 600,
                        lineHeight: 1,
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {group.title}
                    </Typography>
                  </Box>
                  <Typography className="mt-5 max-w-[650px] text-sm leading-7 text-muted">
                    {group.description}
                  </Typography>
                </Box>

                <Box component="ul" className="list-none">
                  {group.items.map((item) => (
                    <Box
                      component="li"
                      key={item.title}
                      className="grid grid-cols-1 gap-3 border-b border-line py-7 md:grid-cols-[minmax(180px,0.7fr)_minmax(0,1.3fr)] md:items-baseline md:gap-8 md:py-8"
                    >
                      <Typography
                        component="h3"
                        className="text-base font-semibold tracking-[-0.02em] text-ink md:text-lg"
                      >
                        {item.title}
                      </Typography>
                      <Typography className="max-w-[620px] text-sm leading-6 text-muted">
                        {item.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </SectionReveal>
            );
          })}
        </Box>

        <SectionReveal className="mx-auto mt-20 grid max-w-[1280px] gap-7 rounded-2xl border border-line bg-panel p-7 md:mt-28 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12 md:p-12 lg:gap-20 lg:p-14">
          <Box className="min-w-0">
            <Typography
              component="h2"
              sx={{
                fontSize: 'clamp(28px, 2.8vw, 40px)',
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: '-0.03em',
              }}
            >
              {t('downloads.help_title')}
            </Typography>
          </Box>
          <Box className="min-w-0">
            <Typography className="max-w-[540px] text-base leading-7 text-muted">
              {t('downloads.help_description')}
            </Typography>
            <Box
              component="a"
              href="mailto:info@zero-lab.tech"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-colors hover:bg-primary-dark hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {t('downloads.contact')}
            </Box>
          </Box>
        </SectionReveal>
      </Box>
    </Box>
  );
}
