import { Box, Typography } from "@mui/material";

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

export default function PartnerCarousel() {
  const duplicated = [...partners, ...partners.slice(0, 5)];

  return (
    <Box className="w-[80%] mx-auto text-center pt-[100px] max-md:w-[95%]">
      <Typography variant="h4" className="font-semibold text-[#222] mb-5">
        合作伙伴 Partners
      </Typography>
      <Typography variant="body2" className="text-[#777] mb-10 leading-relaxed">
        ZeroLab
        与众多优秀企业建立了深度合作关系，共同推动动作捕捉技术的发展与应用。
        <br />
        我们的合作伙伴遍布人形机器人、灵巧手、教育、医疗等多个领域，携手创造更美好的动作数字化和人形机器人未来。
      </Typography>

      <Box className="overflow-hidden my-12 group">
        <Box
          className="flex whitespace-nowrap"
          sx={{
            width: `calc(${duplicated.length} * 290px)`,
            animation: "scroll 45s linear infinite",
            "&:hover": { animationPlayState: "paused" },
          }}
        >
          {duplicated.map((partner, i) => (
            <Box
              key={i}
              className="flex-none w-[250px] mx-5 text-center bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)] p-[30px] transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:-translate-y-1 max-md:w-[180px] max-md:mx-2.5 max-md:p-5"
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
    </Box>
  );
}
