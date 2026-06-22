import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

interface VideoCardProps {
  title: string;
  description: string;
  videoSrc: string;
  linkTo?: string;
}

export default function VideoCard({
  title,
  description,
  videoSrc,
  linkTo = "/contact",
}: VideoCardProps) {
  return (
    <Box className="mb-10">
      <Box className="w-full">
        <video
          src={videoSrc}
          controls
          muted
          autoPlay
          className="w-full"
        />
      </Box>
      <Typography variant="h6" className="font-semibold text-[#222] my-5">
        {title}
      </Typography>
      <Typography variant="body2" className="text-[#999] leading-relaxed">
        {description}
      </Typography>
      <Link to={linkTo} className="inline-block mt-5">
        <Button
          variant="outlined"
          className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
        >
          了解更多
        </Button>
      </Link>
    </Box>
  );
}
