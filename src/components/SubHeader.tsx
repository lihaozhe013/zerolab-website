import { Box, Typography } from "@mui/material";
import Navbar from "@/components/Navbar";

interface SubHeaderProps {
  title: string;
  backgroundImage?: string;
}

export default function SubHeader({
  title,
  backgroundImage = "/images/Background.jpg",
}: SubHeaderProps) {
  return (
    <Box
      className="relative h-[50vh] w-full bg-cover bg-center text-white flex flex-col"
      sx={{
        backgroundImage: `linear-gradient(rgba(4,9,30,0.7),rgba(4,9,30,0.7)),url(${backgroundImage})`,
      }}
    >
      <Navbar transparent />
      <Box className="flex-1 flex items-center justify-center mt-16">
        <Typography variant="h3" className="font-semibold text-center px-4">
          {title}
        </Typography>
      </Box>
    </Box>
  );
}
