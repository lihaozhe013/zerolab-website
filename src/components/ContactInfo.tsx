import { Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

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
        <Typography variant="h6" className="text-[#08b4ce] font-normal text-lg mb-2">
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
  return (
    <Box className="w-[80%] mx-auto">
      <Box className="flex flex-wrap justify-around items-center max-md:flex-col">
        <ContactItem
          icon={<HomeIcon />}
          title="天盛科创广场C座908室"
          subtitle="上海市杨浦区政立路421号"
        />
        <ContactItem
          icon={<PhoneIcon />}
          title="021-55809628"
          subtitle="周一到周五，上午 9 点到下午 6 点"
        />
        <ContactItem
          icon={<EmailIcon />}
          title="info@zero-lab.tech"
          subtitle="可以通过邮件方式咨询我们"
        />
      </Box>
    </Box>
  );
}
