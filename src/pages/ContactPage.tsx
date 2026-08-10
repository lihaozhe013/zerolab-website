import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContactInfo from '@/components/ContactInfo';
import SectionReveal from '@/components/SectionReveal';
import SubHeader from '@/components/SubHeader';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const AMap: any;

export default function ContactPage() {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: any;
    const initializeMap = () => {
      if (typeof AMap === 'undefined' || !mapRef.current) return;
      map = new AMap.Map(mapRef.current, {
        zoom: 15,
        center: [121.533309, 31.27254],
      });
      map.add(new AMap.Marker({
        position: new AMap.LngLat(121.533309, 31.27254),
        title: t('contact.map_marker'),
      }));
    };

    const existingScript = document.querySelector<HTMLScriptElement>('script[src*="webapi.amap.com"]');
    if (existingScript) {
      if (typeof AMap !== 'undefined') initializeMap();
      else existingScript.addEventListener('load', initializeMap, { once: true });
    } else {
      const script = document.createElement('script');
      script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=e70f16c01975d0903747504fe81c0f0f';
      script.async = true;
      script.addEventListener('load', initializeMap, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      existingScript?.removeEventListener('load', initializeMap);
      map?.destroy?.();
    };
  }, [t]);

  return (
    <Box component="main" className="overflow-x-clip bg-[#07090c] text-white">
      <SubHeader
        title={t('contact.title')}
        subtitle={t('contact.intro')}
        backgroundImage="/images/Collab.jpg"
      />

      <Box component="section" className="px-6 py-28 md:px-[6vw] md:py-40">
        <Box className="mx-auto max-w-[1280px]">
          <ContactInfo />

          <SectionReveal className="mt-28 md:mt-40">
            <Typography
              component="h2"
              sx={{
                fontSize: 'clamp(36px, 5vw, 72px)',
                fontWeight: 600,
                lineHeight: 0.96,
                letterSpacing: '-0.05em',
              }}
            >
              {t('contact.visit')}
            </Typography>
            <Box className="mt-10 overflow-hidden bg-[#111419] p-1.5">
              <Box ref={mapRef} className="h-[440px] w-full bg-[#111419] md:h-[620px]" />
            </Box>
          </SectionReveal>
        </Box>
      </Box>
    </Box>
  );
}
