import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubHeader from "@/components/SubHeader";

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

export default function ProductPage() {
  const { t } = useTranslation();
  const items = t("product.items", { returnObjects: true }) as { title: string; description: string; link_text?: string }[];

  return (
    <>
      <SubHeader title={t("product.title")} backgroundImage="/images/Product.jpg" />

      <Box className="w-[80%] mx-auto py-[80px] max-md:w-[90%]">
        <Box className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
          {items.map((product, i) => (
            <Box
              key={i}
              className="flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 bg-white"
            >
              <Box className="relative overflow-hidden">
                <Box
                  component="img"
                  src={productImages[i]}
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
                <Link to={productLinks[i]} className="self-start">
                  <Button
                    variant="outlined"
                    className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
                  >
                    {product.link_text || t("common.learn_more")}
                  </Button>
                </Link>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}