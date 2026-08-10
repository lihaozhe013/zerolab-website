import { Box, Typography } from '@mui/material';

interface SubHeaderProps {
  title: string;
  backgroundImage?: string;
}

export default function SubHeader({ title }: SubHeaderProps) {
  return (
    <Box
      className="relative flex h-[28vh] w-full items-center justify-center bg-[#575a69] text-white"
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
