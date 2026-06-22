import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import PartnerCarousel from "@/components/PartnerCarousel";
import ApplicationCard from "@/components/ApplicationCard";

const productImages = [
  "/images/openarmz.jpg",
  "/images/主图6.png",
  "/images/主图4.png",
  "/images/主图5.png",
];

const appImages = [
  "/images/Designer (7).png",
  "/images/Designer (8).png",
  "/images/Designer (9).png",
];

const envImages = [
  "/images/reception.png",
  "/images/Lab.JPG",
  "/images/Datacenter.JPG",
];

export default function HomePage() {
  const { t } = useTranslation();
  const productItems = t("home.products.items", { returnObjects: true }) as { title: string; description: string }[];
  const appItems = t("home.applications.items", { returnObjects: true }) as { title: string }[];
  const envItems = t("home.environments.items", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <>
      {/* Hero Section */}
      <Box
        className="min-h-screen w-full bg-cover bg-center relative flex flex-col"
        sx={{
          backgroundImage:
            "linear-gradient(rgba(4,9,30,0.7),rgba(4,9,30,0.7)),url(/images/banner.png)",
        }}
      >
        <Navbar transparent />
        <Box className="flex-1 flex items-center justify-center text-center text-white px-4">
          <Box className="max-w-[90%]">
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: "40px", md: "60px" }, mb: 6 }}
              className="font-semibold"
            >
              {t("home.hero.title")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 6 }}
              className="text-xl mt-2.5 leading-relaxed max-md:text-base"
            >
              {t("home.hero.description_p1")}
              <br />
              {t("home.hero.description_p2")}
            </Typography>
            <Link to="/about">
              <Button
                variant="outlined"
                className="text-white border-white px-8 py-3 text-[13px] hover:border-[#08b4ce] hover:bg-[#08b4ce] transition-all duration-1000 normal-case"
              >
                {t("common.learn_more")}
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Partners Section */}
      <PartnerCarousel />

      {/* Products Section */}
      <Box className="w-[80%] mx-auto text-center pt-[100px] max-md:w-[90%]">
        <Typography variant="h4" sx={{ mb: 3 }} className="font-semibold">
          {t("home.products.title")}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 10 }}
          className="text-[#777] leading-relaxed"
        >
          {t("home.products.subtitle")}
        </Typography>
        <Box className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
          {productItems.map((product, i) => (
            <Box
              key={i}
              className="flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 bg-white"
            >
              <Box className="relative overflow-hidden">
                <Box
                  component="img"
                  src={productImages[i]}
                  alt={product.title}
                  className="w-full h-[280px] object-cover transition-transform duration-700 hover:scale-110 max-md:h-[220px]"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </Box>
              <Box className="p-6 flex flex-col flex-1 text-left max-md:p-4">
                <Typography variant="h5" sx={{ mb: 2 }} className="font-semibold">
                  {product.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 4 }}
                  className="text-[#777] leading-relaxed flex-1 text-sm"
                >
                  {product.description}
                </Typography>
                <Link to="/product" className="self-start">
                  <Button
                    variant="outlined"
                    className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
                  >
                    {t("common.learn_more")}
                  </Button>
                </Link>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Applications Section */}
      <Box className="w-[80%] mx-auto text-center pt-[50px] max-md:w-[90%]">
        <Typography variant="h4" sx={{ mb: 3 }} className="font-semibold">
          {t("home.applications.title")}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 10 }}
          className="text-[#777] leading-relaxed"
        >
          {t("home.applications.subtitle")}
        </Typography>
        <Box className="flex flex-wrap justify-between gap-5 max-md:flex-col">
          {appItems.map((app, i) => (
            <ApplicationCard key={i} title={app.title} image={appImages[i]} />
          ))}
        </Box>
      </Box>

      {/* Environment Section */}
      <Box className="w-[80%] mx-auto text-center pt-[100px] max-md:w-[90%]">
        <Typography variant="h4" sx={{ mb: 3 }} className="font-semibold">
          {t("home.environments.title")}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 10 }}
          className="text-[#777] leading-relaxed"
        >
          {t("home.environments.subtitle")}
        </Typography>
        <Box className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
          {envItems.map((env, i) => (
            <Box
              key={i}
              className="flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 bg-white"
            >
              <Box className="relative overflow-hidden">
                <Box
                  component="img"
                  src={envImages[i]}
                  alt={env.title}
                  className="w-full h-[240px] object-cover transition-transform duration-700 hover:scale-110 max-md:h-[200px]"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </Box>
              <Box className="p-5 flex flex-col flex-1 text-left">
                <Typography variant="h6" sx={{ mb: 2 }} className="font-semibold">
                  {env.title}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-[#777] leading-relaxed text-sm flex-1"
                >
                  {env.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* CTA Section */}
      <Box
        className="my-[100px] mx-auto w-[80%] bg-cover bg-center rounded-lg text-center py-[100px] max-md:py-16"
        sx={{
          backgroundImage:
            "linear-gradient(rgba(40,40,40,0.7),rgba(40,40,40,0.7)),url(/images/Cooperation.jpg)",
        }}
      >
        <Typography variant="h4" sx={{ mb: 10 }} className="text-white font-semibold">
          {t("home.cta.title")}
        </Typography>
        <Link to="/contact">
          <Button
            variant="outlined"
            className="text-white border-white px-8 py-3 text-[13px] hover:border-[#08b4ce] hover:bg-[#08b4ce] transition-all duration-1000 normal-case"
          >
            {t("common.contact_us")}
          </Button>
        </Link>
      </Box>
    </>
  );
}