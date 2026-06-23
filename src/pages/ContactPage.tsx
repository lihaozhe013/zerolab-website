import { useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import SubHeader from "@/components/SubHeader";
import ContactInfo from "@/components/ContactInfo";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const AMap: any;

export default function ContactPage() {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://webapi.amap.com/maps?v=1.4.15&key=e70f16c01975d0903747504fe81c0f0f";
    script.async = true;
    script.onload = () => {
      if (typeof AMap !== "undefined" && mapRef.current) {
        const map = new AMap.Map(mapRef.current, {
          zoom: 15,
          center: [121.533309, 31.27254],
        });
        const marker = new AMap.Marker({
          position: new AMap.LngLat(121.533309, 31.27254),
          title: t("contact.map_marker"),
        });
        map.add(marker);
      }
    };
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src*="webapi.amap.com"]',
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [t]);

  return (
    <>
      <SubHeader title={t("contact.title")} backgroundImage="/images/Contact.jpg" />

      <Box className="w-[70%] mx-auto py-[100px] max-md:w-[90%]">
        <div
          ref={mapRef}
          className="w-full h-[600px] max-md:h-[400px]"
        />
      </Box>

      <Box className="pb-10">
        <ContactInfo />
      </Box>
    </>
  );
}