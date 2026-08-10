import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SubHeader from '@/components/SubHeader';

interface AppRowProps {
  title: string;
  description: string;
  image: string;
  reversed?: boolean;
}

function AppRow({ title, description, image, reversed = false }: AppRowProps) {
  const { t } = useTranslation();
  return (
    <Box className={`flex ${reversed ? 'flex-row-reverse' : ''} max-md:flex-col`}>
      <Box className="relative w-1/2 overflow-hidden bg-[#e9eff0] max-md:w-full">
        <Box
          component="img"
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-xl"
        />
        <Box
          component="img"
          src={image}
          alt={title}
          className="relative z-10 h-[50vh] w-full object-contain object-center max-md:h-[250px]"
        />
      </Box>
      <Box className="w-1/2 max-md:w-full flex items-center">
        <Box className="px-14 py-12 max-md:px-6 max-md:py-8">
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#222' }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, lineHeight: 1.9 }} className="text-[#666]">
            {description}
          </Typography>
          <Link to="/contact">
            <Button
              variant="outlined"
              className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
            >
              {t('common.contact_us')}
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

const appImages = [
  '/images/Teleoperation 2.png',
  '/images/LigntTrackerInertia20221020.png',
  '/images/Sports.png',
  '/images/Gaming.png',
  '/images/Virtual live.jpg',
  '/images/Rehabilitation training.jpg',
];

export default function ApplicationPage() {
  const { t } = useTranslation();
  const items = t('application.items', { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  return (
    <>
      <SubHeader title={t('application.title')} />

      <Box>
        {items.map((app, index) => (
          <AppRow
            key={index}
            title={app.title}
            description={app.description}
            image={appImages[index]}
            reversed={index % 2 === 1}
          />
        ))}
      </Box>
    </>
  );
}
