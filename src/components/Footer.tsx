import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <Box className="w-full text-center py-8 px-4">
      <Typography variant="h6" className="font-semibold mb-4 mt-4">
        {t("footer.about_title")}
      </Typography>
      <Typography
        variant="body2"
        className="text-[#777] text-sm leading-relaxed"
      >
        {t("footer.description")}
        <br />
        {t("footer.slogan")}
      </Typography>
      <Box className="my-4 flex justify-center">
        <Box
          component="img"
          src="/images/Wechat Accounts.jpg"
          alt="WeChat"
          className="max-w-[150px]"
        />
      </Box>
      <Typography variant="body2" className="text-[#777] text-sm">
        {t("footer.address")}
        <br />
        {t("footer.phone")}
        <br />
        {t("footer.icp")}
      </Typography>
    </Box>
  );
}
