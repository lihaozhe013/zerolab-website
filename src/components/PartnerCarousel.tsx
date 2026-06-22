import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const partnerSrcs = [
  "/images/partner1.png", "/images/partner19.png", "/images/partner7.png",
  "/images/partner3.png", "/images/partner13.png", "/images/partner8.png",
  "/images/partner14.png", "/images/partner2.png", "/images/partner4.png",
  "/images/partner5.png", "/images/partner6.png", "/images/partner16.png",
  "/images/partner18.png", "/images/partner9.png", "/images/partner10.png",
  "/images/partner11.png", "/images/partner12.png", "/images/partner15.png",
  "/images/partner17.png",
];

const ITEM_WIDTH = 290;
const ITEM_WIDTH_MOBILE = 205;

export default function PartnerCarousel() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const itemsPerPage = isMobile ? 2 : 3;
  const maxOffset = partnerSrcs.length - itemsPerPage;
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const partnerNames = t("partners.names", { returnObjects: true }) as string[];

  const autoNext = useCallback(() => {
    setOffset((o) => (o + itemsPerPage > maxOffset ? 0 : o + itemsPerPage));
  }, [itemsPerPage, maxOffset]);

  const nextOne = useCallback(() => {
    setOffset((o) => (o + 1 > maxOffset ? 0 : o + 1));
  }, [maxOffset]);

  const prevOne = useCallback(() => {
    setOffset((o) => (o - 1 < 0 ? maxOffset : o - 1));
  }, [maxOffset]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(autoNext, 2000);
    return () => clearInterval(timerRef.current);
  }, [paused, autoNext]);

  const w = isMobile ? ITEM_WIDTH_MOBILE : ITEM_WIDTH;

  return (
    <Box sx={{ pb: 4 }} className="w-[80%] mx-auto text-center pt-[60px] max-md:w-[95%]">
      <Typography variant="h4" sx={{ mb: 3 }} className="font-semibold text-[#222]">
        {t("partners.title")}
      </Typography>

      <Box
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Box className="overflow-hidden">
          <Box
            sx={{
              display: "flex",
              transition: "transform 0.6s ease",
              transform: `translateX(-${offset * w}px)`,
            }}
          >
            {partnerSrcs.map((src, i) => (
              <Box
                key={i}
                className="flex-none text-center bg-white rounded-2xl p-[30px] transition-all duration-500 hover:-translate-y-1 border border-gray-200 hover:border-[#08b4ce]"
                sx={{ width: w - 40, mx: 2.5 }}
              >
                <Box
                  component="img"
                  src={src}
                  alt={partnerNames[i] || ""}
                  className="w-[200px] h-[200px] object-contain rounded bg-transparent max-md:w-[140px] max-md:h-[140px]"
                />
              </Box>
            ))}
          </Box>
        </Box>

        <IconButton
          onClick={prevOne}
          sx={{
            position: "absolute",
            left: { xs: -16, md: -24 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "white",
            boxShadow: 3,
            "&:hover": { bgcolor: "#f0f0f0" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton
          onClick={nextOne}
          sx={{
            position: "absolute",
            right: { xs: -16, md: -24 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "white",
            boxShadow: 3,
            "&:hover": { bgcolor: "#f0f0f0" },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
}