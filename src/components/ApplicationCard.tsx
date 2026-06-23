import { Box, Typography } from '@mui/material';

interface ApplicationCardProps {
  title: string;
  image: string;
}

export default function ApplicationCard({ title, image }: ApplicationCardProps) {
  return (
    <Box className="relative flex-1 min-w-[32%] rounded-lg overflow-hidden mb-7 max-md:min-w-full group cursor-pointer">
      <Box
        component="img"
        src={image}
        alt={title}
        className="w-full block transition-transform duration-500 group-hover:scale-105"
      />
      <Box className="absolute inset-0 bg-transparent transition-colors duration-500 group-hover:bg-[rgba(0,195,254,0.7)]" />
      <Typography
        variant="h5"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center font-medium text-white opacity-0 transition-all duration-500 translate-y-4 group-hover:opacity-100 group-hover:bottom-1/2 group-hover:translate-y-1/2"
      >
        {title}
      </Typography>
    </Box>
  );
}
