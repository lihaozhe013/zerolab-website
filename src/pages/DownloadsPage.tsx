import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
    version: string;
    platform: string;
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
  const releaseCount = groups.reduce(
    (total, group) => total + group.items.length,
    0,
  );

  return (
    <Box component="main" className="overflow-x-clip bg-[#07090c] text-white">
      <SubHeader title={t('downloads.title')} subtitle={t('downloads.intro')} />

      <Box component="section" className="px-6 py-24 md:px-[6vw] md:py-36">
        <Box className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          <Box component="aside" className="lg:col-span-3">
            <Box className="border-t border-white/15 pt-5 lg:sticky lg:top-28">
              <Typography className="text-xs font-semibold tracking-[0.18em] text-white/40">
                {t('downloads.contents')}
              </Typography>
              <Box component="nav" className="mt-6 flex flex-col">
                {groups.map((group, index) => (
                  <Box
                    component="a"
                    href={`#${group.id}`}
                    key={group.id}
                    className="group grid grid-cols-[32px_1fr] border-t border-white/10 py-4 text-sm text-white/60 transition-colors first:border-t-0 hover:text-[#4bd0e4]"
                  >
                    <span className="font-mono text-[11px] tabular-nums text-white/30 group-hover:text-[#4bd0e4]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{group.title}</span>
                  </Box>
                ))}
              </Box>
              <Typography className="mt-8 text-xs leading-5 text-white/35">
                {t('downloads.summary', { count: releaseCount })}
              </Typography>
            </Box>
          </Box>

          <Box className="space-y-24 lg:col-span-9 lg:col-start-5">
            <SectionReveal className="border border-[#4bd0e4]/30 bg-[#4bd0e4]/[0.045] p-6 md:p-8">
              <Box className="flex items-start gap-4">
                <CloudDownloadOutlinedIcon
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#4bd0e4]"
                  sx={{ fontSize: 26 }}
                />
                <Box>
                  <Typography
                    component="h2"
                    className="text-base font-semibold text-white"
                  >
                    {t('downloads.preview_title')}
                  </Typography>
                  <Typography className="mt-2 max-w-[680px] text-sm leading-7 text-white/50">
                    {t('downloads.preview_description')}
                  </Typography>
                </Box>
              </Box>
            </SectionReveal>

            {groups.map((group, groupIndex) => {
              const GroupIcon = groupIcons[group.kind];

              return (
                <SectionReveal
                  component="section"
                  id={group.id}
                  key={group.id}
                  className="scroll-mt-28"
                >
                  <Box className="mb-10 grid grid-cols-[40px_1fr] gap-5 border-b border-white/15 pb-7 md:grid-cols-[48px_1fr_auto] md:items-end">
                    <GroupIcon
                      aria-hidden="true"
                      className="text-[#4bd0e4]"
                      sx={{ fontSize: 28 }}
                    />
                    <Box>
                      <Typography className="mb-3 font-mono text-xs tabular-nums text-[#4bd0e4]">
                        {String(groupIndex + 1).padStart(2, '0')}
                      </Typography>
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
                      <Typography className="mt-4 max-w-[650px] text-sm leading-7 text-white/45">
                        {group.description}
                      </Typography>
                    </Box>
                    <Typography className="col-start-2 font-mono text-xs tabular-nums text-white/35 md:col-start-3">
                      {group.items.length} {t('downloads.packages')}
                    </Typography>
                  </Box>

                  <Box className="hidden grid-cols-[minmax(0,1fr)_90px_120px_140px] gap-5 border-b border-white/10 px-1 pb-4 md:grid">
                    <Typography className="text-xs font-medium text-white/35">
                      {t('downloads.columns.description')}
                    </Typography>
                    <Typography className="text-xs font-medium text-white/35">
                      {t('downloads.columns.version')}
                    </Typography>
                    <Typography className="text-xs font-medium text-white/35">
                      {t('downloads.columns.platform')}
                    </Typography>
                    <Typography className="text-xs font-medium text-white/35">
                      {t('downloads.columns.resource')}
                    </Typography>
                  </Box>

                  <Box>
                    {group.items.map((item) => (
                      <Box
                        component="article"
                        key={item.title}
                        className="group grid grid-cols-1 gap-7 border-b border-white/10 px-1 py-8 transition-colors hover:border-[#4bd0e4]/35 md:grid-cols-[minmax(0,1fr)_90px_120px_140px] md:items-center md:gap-5"
                      >
                        <Box>
                          <Typography
                            component="h3"
                            className="text-base font-semibold tracking-[-0.02em] text-white md:text-lg"
                          >
                            {item.title}
                          </Typography>
                          <Typography className="mt-2 max-w-[560px] text-sm leading-6 text-white/45">
                            {item.description}
                          </Typography>
                        </Box>

                        <Box className="grid grid-cols-2 gap-6 md:contents">
                          <Box>
                            <Typography className="mb-2 text-[11px] text-white/30 md:hidden">
                              {t('downloads.columns.version')}
                            </Typography>
                            <Typography className="font-mono text-xs tabular-nums text-white/55">
                              {item.version}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography className="mb-2 text-[11px] text-white/30 md:hidden">
                              {t('downloads.columns.platform')}
                            </Typography>
                            <Typography className="text-xs text-white/55">
                              {item.platform}
                            </Typography>
                          </Box>
                        </Box>

                        <button
                          type="button"
                          disabled
                          className="inline-flex min-h-11 w-fit cursor-not-allowed items-center gap-2 border border-white/15 px-4 py-2 text-sm font-semibold text-white/30"
                        >
                          {t('downloads.coming_soon')}
                          <CloudDownloadOutlinedIcon
                            sx={{ fontSize: 18 }}
                            aria-hidden="true"
                          />
                        </button>
                      </Box>
                    ))}
                  </Box>
                </SectionReveal>
              );
            })}

            <SectionReveal className="border-t border-white/15 pt-10">
              <Typography
                component="h2"
                sx={{
                  fontSize: 'clamp(30px, 3.5vw, 48px)',
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}
              >
                {t('downloads.help_title')}
              </Typography>
              <Typography className="mt-5 max-w-[620px] text-sm leading-7 text-white/50">
                {t('downloads.help_description')}
              </Typography>
              <Box
                component="a"
                href="mailto:info@zero-lab.tech"
                className="mt-8 inline-flex min-h-12 items-center bg-[#4bd0e4] px-6 py-3 text-sm font-semibold text-[#071013] transition-[background-color,transform] duration-300 hover:bg-white active:scale-[0.98]"
              >
                {t('downloads.contact')}
              </Box>
            </SectionReveal>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
