import { useState, useRef, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import SubHeader from "@/components/SubHeader";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const products = [
  {
    title: "人形机器人遥操作",
    image: "/images/openarmz.jpg",
    description:
      "人形机器人通常由30个电机构成，传统的编程方式无法实现人形机器人的全身控制。天璺科技提供从动作映射到运动控制的完整数采和遥操作解决方案，助力用户加速人形机器人的运动能力、拟人化运动、模仿学习和零成本迁移。",
    link: "/teleop",
    linkText: "方案介绍",
  },
  {
    title: "F1 全身动作捕捉套装",
    image: "/images/LigntTrackerInertia20221020.png",
    description:
      "F-1 是一套全身动作捕捉系统，拥有 13 个无线传感器固定在身体的活动节点上，配备一套贴身、舒适的 Tracker 固定绑带，支持快速、简单、可靠的动作数据捕捉，其作为影视专业和动画制作从业人员的理想选择。",
    link: "/document/F-1彩页.pdf",
  },
  {
    title: "H1 开发者数据手套",
    image: "/images/DataGloves.png",
    description:
      "H1 Data Gloves 是一款名副其实的「高性价比、高精度、轻便佩戴的数据手套」，它每根手指拥有 10-bit 分辨率的高精度弯曲传感器结合低延迟通讯一体化的惯性姿态模块，可以实时捕捉手部精细动作。",
    link: "/document/H-1彩页.pdf",
  },
  {
    title: "ZL9NSQ SiP 无线姿态传感器芯片",
    image: "/images/Motion Tracker.jpg",
    description:
      "ZeroLab 超轻薄无线姿态传感器芯片 ZL9NSQ 适用于动作捕捉领域的低功耗、高精度 All-In-One 芯片级系统解决方案。运用行业最新的 Chiplet 技术，在极小的 10x10x2mm 的封装中实现了前所未有的集成度。",
    link: "/document/ZL9NSQ单页-0604.pdf",
  },
];

// 每2个一组
const pages: (typeof products)[] = [];
for (let i = 0; i < products.length; i += 2) {
  pages.push(products.slice(i, i + 2));
}

export default function ProductPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
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
      <SubHeader title="我们的产品 Products" backgroundImage="/images/Product.jpg" />

      {/* Scroll-snap container */}
      <Box
        ref={scrollRef}
        sx={{
          height: "calc(100vh - 50vh)",
          overflowY: "auto",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
          // hide scrollbar
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
              {page.map((product) => (
                <Box
                  key={product.title}
                  className="flex-1 flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 bg-white"
                >
                  <Box className="relative overflow-hidden">
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.title}
                      className="w-full h-[280px] object-cover transition-transform duration-700 hover:scale-110 max-md:h-[200px]"
                    />
                    <Box className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  </Box>

                  <Box className="p-6 flex flex-col flex-1 max-md:p-4">
                    <Typography variant="h5" className="font-semibold mb-3 max-md:text-lg">
                      {product.title}
                    </Typography>
                    <Typography variant="body2" className="text-[#777] leading-relaxed mb-4 flex-1 max-md:text-sm">
                      {product.description}
                    </Typography>
                    <Link to={product.link} className="self-start">
                      <Button
                        variant="outlined"
                        className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
                      >
                        {product.linkText || "了解更多"}
                      </Button>
                    </Link>
                  </Box>
                </Box>
              ))}
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
                backgroundColor: activePage === idx ? "#08b4ce" : "#d1d5db",
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
