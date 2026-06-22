import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const partners = [
  { src: "/images/partner1.png", alt: "宇树" },
  { src: "/images/partner19.png", alt: "智元机器人" },
  { src: "/images/partner7.png", alt: "矩阵" },
  { src: "/images/partner3.png", alt: "睿尔曼" },
  { src: "/images/partner13.png", alt: "PND" },
  { src: "/images/partner8.png", alt: "擎郎" },
  { src: "/images/partner14.png", alt: "零次方" },
  { src: "/images/partner2.png", alt: "钛虎" },
  { src: "/images/partner4.png", alt: "因时" },
  { src: "/images/partner5.png", alt: "傲意" },
  { src: "/images/partner6.png", alt: "卧龙" },
  { src: "/images/partner16.png", alt: "节卡" },
  { src: "/images/partner18.png", alt: "大象机器人" },
  { src: "/images/partner9.png", alt: "奇瑞" },
  { src: "/images/partner10.png", alt: "复旦" },
  { src: "/images/partner11.png", alt: "上海交大" },
  { src: "/images/partner12.png", alt: "同济" },
  { src: "/images/partner15.png", alt: "中科深谷" },
  { src: "/images/partner17.png", alt: "合工大" },
];

const ITEM_WIDTH = 290;
const ITEM_WIDTH_MOBILE = 205;

export default function PartnerCarousel() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const itemsPerPage = isMobile ? 2 : 3;
  const maxOffset = partners.length - itemsPerPage;
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

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
    timerRef.current = setInterval(autoNext, 3000);
    return () => clearInterval(timerRef.current);
  }, [paused, autoNext]);

  const w = isMobile ? ITEM_WIDTH_MOBILE : ITEM_WIDTH;

  return (
    <Box sx={{ pb: 12 }} className="w-[80%] mx-auto text-center pt-[100px] max-md:w-[95%]">
      <Typography variant="h4" sx={{ mb: 5 }} className="font-semibold text-[#222]">
        合作伙伴 Partners
      </Typography>
      <Typography variant="body2" sx={{ mb: 10 }} className="text-[#777] leading-relaxed">
        ZeroLab
        与众多优秀企业建立了深度合作关系，共同推动动作捕捉技术的发展与应用。
        <br />
        我们的合作伙伴遍布人形机器人、灵巧手、教育、医疗等多个领域，携手创造更美好的动作数字化和人形机器人未来。
      </Typography>

      <Box
        className="my-12 relative"
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
            {partners.map((partner, i) => (
              <Box
                key={i}
                className="flex-none text-center bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)] p-[30px] transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:-translate-y-1"
                sx={{ width: w - 40, mx: 2.5 }}
              >
                <Box
                  component="img"
                  src={partner.src}
                  alt={partner.alt}
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
