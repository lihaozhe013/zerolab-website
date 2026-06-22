import { Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { useTranslation } from "react-i18next";

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function ContactItem({ icon, title, subtitle }: ContactItemProps) {
  return (
    <Box className="flex items-center gap-8 mb-10 flex-1 justify-center">
      <Box className="text-[#08b4ce] text-[30px]">{icon}</Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }} className="text-[#08b4ce] font-normal text-lg">
          {title}
        </Typography>
        <Typography variant="body2" className="text-[#777]">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

export default function ContactInfo() {
  const { t } = useTranslation();
  return (
    <Box className="w-[80%] mx-auto">
      <Box className="flex flex-wrap justify-around items-center max-md:flex-col">
        <ContactItem
          icon={<HomeIcon />}
          title={t("contact.address_title")}
          subtitle={t("contact.address_subtitle")}
        />
        <ContactItem
          icon={<PhoneIcon />}
          title={t("contact.phone")}
          subtitle={t("contact.hours")}
        />
        <ContactItem
          icon={<EmailIcon />}
          title={t("contact.email")}
          subtitle={t("contact.email_prompt")}
        />
      </Box>
    </Box>
  );
}
