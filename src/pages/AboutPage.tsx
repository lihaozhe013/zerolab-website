import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubHeader from "@/components/SubHeader";

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <>
      <SubHeader
        title={t("about.title")}
        backgroundImage="/images/Crew1.jpg"
      />

      <Box className="w-[80%] mx-auto pt-[80px] pb-[50px] text-center max-md:w-[90%]">
        <Box className="flex-1 px-0.5 max-w-[900px] mx-auto">
            <Typography
              variant="h4"
              sx={{ mb: 1, fontWeight: 800 }}
              className="text-[28px] leading-relaxed"
            >
              {t("about.company_name")}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ mb: 8 }}
              className="text-[#999] leading-relaxed"
            >
              {t("about.company_name_en")}
            </Typography>
          <Typography
            variant="body1"
            className="text-base leading-[1.8] text-[#666] text-justify"
          >
            {t("about.description")}
          </Typography>
          <Link to="/contact" className="inline-block mt-5">
            <Button
              variant="outlined"
              className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
            >
              {t("common.learn_more")}
            </Button>
          </Link>
        </Box>
      </Box>
    </>
  );
}