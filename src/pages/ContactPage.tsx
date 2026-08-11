import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContactInfo from '@/components/ContactInfo';
import SectionReveal from '@/components/SectionReveal';
import SubHeader from '@/components/SubHeader';

declare const AMap: any;

const LOCATION = [121.533309, 31.27254] as const;

type MapStatus = 'loading' | 'ready' | 'error';

export default function ContactPage() {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapStatus, setMapStatus] = useState<MapStatus>('loading');

  const directionsUrl = `https://uri.amap.com/navigation?from=&to=${LOCATION[0]},${LOCATION[1]},${encodeURIComponent(
    t('contact.map_marker'),
  )}&mode=car&policy=1&src=zerolab-website&callnative=1`;

  useEffect(() => {
    let map: any;
    let marker: any;
    let infoWindow: any;
    let handleMarkerClick: (() => void) | undefined;

    const handleScriptError = () => setMapStatus('error');

    const initializeMap = () => {
      if (typeof AMap === 'undefined' || !mapRef.current) return;

      map = new AMap.Map(mapRef.current, {
        zoom: 15,
        center: LOCATION,
      });

      const location = new AMap.LngLat(...LOCATION);
      marker = new AMap.Marker({
        position: location,
        title: t('contact.map_marker'),
        cursor: 'pointer',
      });

      const infoContent = document.createElement('div');
      infoContent.className = 'zerolab-map-info';

      const infoTitle = document.createElement('h3');
      infoTitle.className = 'zerolab-map-info__title';
      infoTitle.textContent = t('contact.map_marker');

      const infoAddress = document.createElement('p');
      infoAddress.className = 'zerolab-map-info__address';
      infoAddress.textContent = t('contact.address_subtitle');

      const infoDirections = document.createElement('a');
      infoDirections.className = 'zerolab-map-info__link';
      infoDirections.href = directionsUrl;
      infoDirections.target = '_blank';
      infoDirections.rel = 'noopener noreferrer';
      infoDirections.textContent = t('contact.get_directions');

      infoContent.append(infoTitle, infoAddress, infoDirections);

      infoWindow = new AMap.InfoWindow({
        content: infoContent,
        offset: new AMap.Pixel(0, -32),
        closeWhenClickMap: true,
      });

      handleMarkerClick = () => {
        infoWindow.open(map, location);
        map.panTo(location);
      };

      marker.on('click', handleMarkerClick);
      map.add(marker);
      setMapStatus('ready');
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="webapi.amap.com"]',
    );
    if (existingScript) {
      if (typeof AMap !== 'undefined') initializeMap();
      else {
        existingScript.addEventListener('load', initializeMap, { once: true });
        existingScript.addEventListener('error', handleScriptError, {
          once: true,
        });
      }
    } else {
      const script = document.createElement('script');
      script.src =
        'https://webapi.amap.com/maps?v=1.4.15&key=e70f16c01975d0903747504fe81c0f0f';
      script.async = true;
      script.addEventListener('load', initializeMap, { once: true });
      script.addEventListener('error', handleScriptError, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      existingScript?.removeEventListener('load', initializeMap);
      existingScript?.removeEventListener('error', handleScriptError);
      if (marker && handleMarkerClick) marker.off?.('click', handleMarkerClick);
      infoWindow?.close?.();
      map?.destroy?.();
    };
  }, [directionsUrl, t]);

  return (
    <Box component="main" className="overflow-x-clip bg-page text-ink">
      <SubHeader
        title={t('contact.title')}
        subtitle={t('contact.intro')}
        backgroundImage="/images/reception.png"
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
            <Typography className="mt-5 max-w-[560px] text-base leading-7 text-muted">
              {t('contact.map_hint')}
            </Typography>
            <Box className="mt-10 overflow-hidden border border-line bg-panel p-1.5">
              <Box className="relative">
                <Box
                  ref={mapRef}
                  className="h-[440px] w-full bg-panel md:h-[620px]"
                />
                {mapStatus !== 'ready' && (
                  <Box className="absolute inset-0 flex items-center justify-center bg-panel px-6 text-center">
                    {mapStatus === 'loading' ? (
                      <Typography className="text-sm text-muted">
                        {t('contact.map_loading')}
                      </Typography>
                    ) : (
                      <Box>
                        <Typography className="text-sm text-muted">
                          {t('contact.map_error')}
                        </Typography>
                        <Box
                          component="a"
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex min-h-11 items-center bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-[background-color,color,transform] duration-300 hover:bg-primary-dark hover:text-white active:scale-[0.98]"
                        >
                          {t('contact.get_directions')}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
              <Box className="flex flex-col gap-4 border-t border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
                <Typography className="text-sm leading-6 text-muted">
                  {t('contact.map_pin_hint')}
                </Typography>
                <Box
                  component="a"
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-[background-color,color,transform] duration-300 hover:bg-primary-dark hover:text-white active:scale-[0.98]"
                >
                  {t('contact.get_directions')}
                </Box>
              </Box>
            </Box>
          </SectionReveal>
        </Box>
      </Box>
    </Box>
  );
}
