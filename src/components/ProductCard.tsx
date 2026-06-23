import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  linkText?: string;
}

export default function ProductCard({
  title,
  description,
  image,
  link,
  linkText,
}: ProductCardProps) {
  const { t } = useTranslation();
  const buttonText = linkText || t('common.learn_more');
  return (
    <Box className="flex flex-wrap justify-between gap-y-5 mb-5 max-md:flex-col">
      <Box className="flex-1 min-w-[48%] bg-[#dbdbdb] rounded-lg p-5 max-md:min-w-full">
        <Box
          component="img"
          src={image}
          alt={title}
          className="w-full h-[400px] object-cover rounded max-md:h-[250px]"
        />
      </Box>
      <Box className="flex-1 min-w-[48%] max-md:min-w-full flex flex-col justify-center">
        <Typography variant="h5" sx={{ mb: 3 }} className="font-semibold">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 5 }} className="text-[#777] leading-relaxed">
          {description}
        </Typography>
        <Link to={link}>
          <Button
            variant="outlined"
            className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
          >
            {buttonText}
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
