import { useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import SubHeader from "@/components/SubHeader";
import ContactInfo from "@/components/ContactInfo";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const AMap: any;

export default function ContactPage() {
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
          center: [121.545, 31.284],
        });
        const marker = new AMap.Marker({
          position: new AMap.LngLat(121.545, 31.284),
          title: "天璺科技（上海）有限公司 ZeroLab",
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
  }, []);

  return (
    <>
      <SubHeader title="联系我们 Contact Us" backgroundImage="/images/Contact.jpg" />

      <Box className="w-[70%] mx-auto py-[100px] max-md:w-[90%]">
        <div
          ref={mapRef}
          className="w-full h-[600px] max-md:h-[400px]"
        />
      </Box>

      <Box className="pb-10">
        <ContactInfo />
      </Box>

      <Box className="text-center py-10">
        <a href="mailto:info@zero-lab.tech">
          <Button
            variant="outlined"
            className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
          >
            发送邮件咨询
          </Button>
        </a>
      </Box>
    </>
  );
}
