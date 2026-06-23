import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <Box className="w-full text-center py-8 px-4">
      <Typography variant="h6" className="font-semibold mb-4 mt-4">
        {t('footer.about_title')}
      </Typography>
      <Typography variant="body2" className="text-[#777] text-sm leading-relaxed">
        {t('footer.description')}
        <br />
        {t('footer.slogan')}
      </Typography>
      <Box className="my-4 flex justify-center">
        <Box
          component="img"
          src="/images/Wechat Accounts.jpg"
          alt="WeChat"
          className="max-w-[150px]"
        />
      </Box>
      <Box className="mb-6">
        <Link to="/contact">
          <Button
            variant="outlined"
            className="border-[#08b4ce] text-[#08b4ce] px-8 py-3 hover:bg-[#08b4ce] hover:text-white normal-case"
          >
            {t('common.contact_us')}
          </Button>
        </Link>
      </Box>
      <Typography variant="body2" className="text-[#777] text-sm">
        {t('footer.address')}
        <br />
        {t('footer.phone')}
        <br />
        {t('footer.icp')}
      </Typography>
    </Box>
  );
}
