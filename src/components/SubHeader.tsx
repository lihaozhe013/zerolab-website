import { Box, Typography } from '@mui/material';

interface SubHeaderProps {
  title: string;
  backgroundImage?: string;
}

export default function SubHeader({
  title,
  backgroundImage = '/images/Background.jpg',
}: SubHeaderProps) {
  return (
    <Box
      className="relative h-[28vh] w-full bg-cover bg-center text-white flex items-center justify-center"
      sx={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65),rgba(0,0,0,0.65)),url(${backgroundImage})`,
      }}
    >
      <Box className="text-center">
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2 }}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 60,
            height: 3,
            bgcolor: '#08b4ce',
            mx: 'auto',
            borderRadius: 2,
          }}
        />
      </Box>
    </Box>
  );
}
