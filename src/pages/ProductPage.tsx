import { useState, useRef, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubHeader from "@/components/SubHeader";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const productImages = [
  "/images/openarmz.jpg",
  "/images/LigntTrackerInertia20221020.png",
  "/images/DataGloves.png",
  "/images/Motion Tracker.jpg",
];

const productLinks = [
  "/teleop",
  "/document/F-1彩页.pdf",
  "/document/H-1彩页.pdf",
  "/document/ZL9NSQ单页-0604.pdf",
];

const productLinkTexts = ["方案介绍", "", "", ""];

// 每2个一组
function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default function ProductPage() {
  const { t } = useTranslation();
  const items = t("product.items", { returnObjects: true }) as { title: string; description: string; link_text?: string }[];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const pages = chunk(items, 2);
  const totalPages = pages.length;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const pageHeight = container.clientHeight;
      const idx = Math.round(scrollTop / pageHeight);
      setActivePage(Math.min(idx, totalPages - 1));
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [totalPages]);

  const scrollToPage = (idx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const target = Math.max(0, Math.min(idx, totalPages - 1));
    container.scrollTo({ top: target * container.clientHeight, behavior: "smooth" });
  };

  return (
    <>
      <SubHeader title={t("product.title")} backgroundImage="/images/Product.jpg" />

      {/* Scroll-snap container */}
      <Box
        ref={scrollRef}
        sx={{
          height: "calc(100vh - 50vh)",
          overflowY: "auto",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {pages.map((page, pageIndex) => (
          <Box
            key={pageIndex}
            sx={{
              height: "calc(100vh - 50vh)",
              scrollSnapAlign: "start",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box className="w-[80%] mx-auto flex gap-8 max-md:w-[90%] max-md:flex-col max-md:gap-5">
              {page.map((product, i) => {
                const globalIdx = pageIndex * 2 + i;
                return (
                  <Box
                    key={globalIdx}
                    className="flex-1 flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 bg-white"
                  >
                    <Box className="relative overflow-hidden">
                      <Box
                        component="img"
                        src={productImages[globalIdx]}
                        alt={product.title}
                        className="w-full h-[280px] object-cover transition-transform duration-700 hover:scale-110 max-md:h-[200px]"
                      />
                      <Box className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                    </Box>

                    <Box className="p-6 flex flex-col flex-1 max-md:p-4">
                      <Typography variant="h5" sx={{ mb: 3 }} className="font-semibold max-md:text-lg">
                        {product.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 4 }} className="text-[#777] leading-relaxed flex-1 max-md:text-sm">
                        {product.description}
                      </Typography>
                      <Link to={productLinks[globalIdx]} className="self-start">
                        <Button
                          variant="outlined"
                          className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
                        >
                          {product.link_text || t("common.learn_more")}
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Navigation arrows */}
      {activePage > 0 && (
        <Box
          className="fixed left-1/2 -translate-x-1/2 top-[calc(50vh-30px)] z-50 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
          onClick={() => scrollToPage(activePage - 1)}
        >
          <Box className="w-12 h-12 rounded-full bg-white/80 shadow-lg flex items-center justify-center backdrop-blur-sm hover:bg-white hover:scale-110 transition-all">
            <ArrowUpwardIcon className="text-[#08b4ce]" />
          </Box>
        </Box>
      )}

      {activePage < totalPages - 1 && (
        <Box
          className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
          onClick={() => scrollToPage(activePage + 1)}
        >
          <Box className="w-12 h-12 rounded-full bg-white/80 shadow-lg flex items-center justify-center backdrop-blur-sm hover:bg-white hover:scale-110 transition-all animate-bounce">
            <ArrowDownwardIcon className="text-[#08b4ce]" />
          </Box>
        </Box>
      )}

      {/* Right page indicator */}
      <Box className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 max-md:right-3">
        {pages.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => scrollToPage(idx)}
            className="cursor-pointer group flex items-center gap-2"
          >
            <Box
              className="transition-all duration-300"
              sx={{
                width: activePage === idx ? 24 : 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: activePage === idx ? "#08b4ce" : "#d1b5db",
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Page counter */}
      <Box className="fixed left-6 bottom-6 text-sm text-[#08b4ce] font-semibold z-50">
        {activePage + 1} / {totalPages}
      </Box>
    </>
  );
}