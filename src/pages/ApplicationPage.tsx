import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubHeader from "@/components/SubHeader";

interface AppRowProps {
  title: string;
  description: string;
  image: string;
  reversed?: boolean;
}

function AppRow({ title, description, image, reversed = false }: AppRowProps) {
  const { t } = useTranslation();
  return (
    <Box
      className={`flex flex-wrap justify-between gap-y-5 mb-5 ${
        reversed ? "flex-row-reverse" : ""
      } max-md:flex-col`}
    >
      <Box className="flex-1 min-w-[48%] max-md:min-w-full">
        <Box component="img" src={image} alt={title} className="w-full rounded" />
      </Box>
      <Box className="flex-1 min-w-[48%] max-md:min-w-full flex flex-col justify-center">
        <Typography variant="h4" sx={{ mb: 5 }} className="font-semibold">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 5 }} className="text-[#777] leading-relaxed">
          {description}
        </Typography>
        <Link to="/contact" className="inline-block">
          <Button
            variant="outlined"
            className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
          >
            {t("common.learn_more")}
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

const appImages = [
  "/images/Robot Training.jpg",
  "/images/The virtual studio.jpg",
  "/images/Sports training.jpg",
  "/images/VR Gaming.jpg",
  "/images/Virtual live.jpg",
  "/images/Rehabilitation training.jpg",
];

export default function ApplicationPage() {
  const { t } = useTranslation();
  const items = t("application.items", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <>
      <SubHeader title={t("application.title")} />

      <Box className="w-[80%] mx-auto pt-[80px] pb-[50px] max-md:w-[90%]">
        {items.map((app, index) => (
          <AppRow
            key={index}
            title={app.title}
            description={app.description}
            image={appImages[index]}
            reversed={index % 2 === 1}
          />
        ))}
      </Box>
    </>
  );
}