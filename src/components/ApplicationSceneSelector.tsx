import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export interface ApplicationSceneItem {
  title: string;
  description: string;
  image: string;
}

interface ApplicationSceneSelectorProps {
  title: string;
  subtitle: string;
  exploreLabel: string;
  items: ApplicationSceneItem[];
}

export default function ApplicationSceneSelector({
  title,
  subtitle,
  exploreLabel,
  items,
}: ApplicationSceneSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(Math.min(1, items.length - 1));
  const activeItem = items[activeIndex];

  return (
    <Box
      component="section"
      className="bg-[#0a0c0f] px-6 py-28 text-white md:px-[6vw] md:py-40"
    >
      <Box className="mx-auto max-w-[1280px]">
        <Typography
          component="h2"
          sx={{
            fontSize: 'clamp(42px, 5vw, 76px)',
            fontWeight: 600,
            lineHeight: 0.96,
            letterSpacing: '-0.05em',
          }}
          className="max-w-[800px]"
        >
          {title}
        </Typography>
        <Typography className="mt-7 max-w-[680px] text-base leading-7 text-white/50">
          {subtitle}
        </Typography>

        <Box className="mt-16 overflow-hidden bg-[#101419] md:mt-20">
          <Box className="relative min-h-[380px] overflow-hidden md:min-h-[520px]">
            {items.map((item, index) => (
              <Box
                key={item.title}
                component="img"
                src={item.image}
                alt={index === activeIndex ? item.title : ''}
                aria-hidden={index !== activeIndex}
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  index === activeIndex
                    ? 'scale-100 opacity-100'
                    : 'pointer-events-none scale-[1.035] opacity-0'
                }`}
              />
            ))}

            <Box className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06080a]/45 via-transparent to-[#06080a]/10" />
          </Box>

          <Box className="grid gap-10 border-t border-white/10 bg-[#080b0e] px-6 py-8 md:grid-cols-12 md:items-end md:gap-12 md:px-10 md:py-10 lg:px-14 lg:py-12">
            <Box className="md:col-span-7">
              <Typography
                component="h3"
                sx={{
                  fontSize: 'clamp(38px, 5vw, 72px)',
                  fontWeight: 600,
                  lineHeight: 0.95,
                  letterSpacing: '-0.05em',
                  textWrap: 'balance',
                }}
                className="max-w-[760px]"
              >
                {activeItem.title}
              </Typography>
              <Typography className="mt-5 max-w-[600px] text-sm leading-6 text-white/65 md:text-base md:leading-7">
                {activeItem.description}
              </Typography>
              <Link
                to="/application"
                className="mt-7 inline-flex min-h-11 items-center gap-2 border-b border-[#4bd0e4] py-2 text-sm font-semibold text-white transition-[color,gap] duration-300 hover:gap-3 hover:text-[#4bd0e4] active:translate-y-px"
              >
                {exploreLabel}
                <ArrowOutwardIcon sx={{ fontSize: 18 }} aria-hidden="true" />
              </Link>
            </Box>

            <Box className="md:col-span-5" role="tablist" aria-label={title}>
              {items.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={item.title}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onPointerEnter={() => setActiveIndex(index)}
                    className={`group relative flex min-h-14 w-full items-center border-t px-1 py-4 text-left transition-[border-color,color,padding] duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4bd0e4] active:translate-y-px md:min-h-16 ${
                      isActive
                        ? 'border-[#4bd0e4] pl-4 text-white'
                        : 'border-white/20 text-white/50 hover:border-white/45 hover:pl-2 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-semibold leading-snug md:text-base">
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
