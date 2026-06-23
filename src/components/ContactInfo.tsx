import { Box, Typography, Card, CardContent } from "@mui/material";
import { FiHome, FiPhone, FiMail } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  extraText?: string;
}

function ContactItem({ icon, title, subtitle, extraText }: ContactItemProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid #eee",
        transition: "border-color 0.3s",
        "&:hover": { borderColor: "#08b4ce" },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 5,
          px: 3,
        }}
      >
        <Box className="text-[#08b4ce] text-[60px] mb-5 leading-none">{icon}</Box>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 700 }}
          className="text-[#222]"
        >
          {title}
        </Typography>
        {extraText && (
          <Typography variant="body2" sx={{ mb: 0.5 }} className="text-[#777]">
            {extraText}
          </Typography>
        )}
        <Typography variant="body2" className="text-[#777]">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function ContactInfo() {
  const { t } = useTranslation();
  return (
    <Box className="w-[80%] mx-auto">
      <Box className="grid grid-cols-3 gap-8 max-md:grid-cols-1 max-md:gap-6">
        <ContactItem
          icon={<FiHome />}
          title={t("contact.address_title")}
          subtitle={t("contact.address_subtitle")}
        />
        <ContactItem
          icon={<FiPhone />}
          title={t("contact.phone")}
          subtitle={t("contact.hours")}
          extraText={t("contact.phone_number")}
        />
        <ContactItem
          icon={<FiMail />}
          title={t("contact.email")}
          subtitle={t("contact.email_prompt")}
        />
      </Box>
    </Box>
  );
}
