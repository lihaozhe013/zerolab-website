import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

const navItems = [
  { key: 'about', path: '/about' },
  { key: 'product', path: '/product' },
  { key: 'solution', path: '/solution' },
  { key: 'application', path: '/application' },
  { key: 'contact', path: '/contact' },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isActive = (path: string) =>
    location.pathname === path || (path === '/product' && location.pathname === '/teleop');

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          backgroundColor: 'rgba(5, 6, 8, 0.82)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: 'none',
          zIndex: 1200,
        }}
      >
        <Toolbar
          className="justify-between"
          sx={{
            px: { xs: 2.5, md: 4 },
            minHeight: { xs: 72, md: 80 },
          }}
        >
          <Link to="/">
            <Box
              component="img"
              src="/images/LOGO1.png"
              alt="ZeroLab Logo"
              sx={{
                height: { xs: 46, md: 58 },
                display: 'block',
                transition: 'transform 180ms ease',
                '&:hover': { transform: 'scale(0.95)' },
              }}
            />
          </Link>

          {isMobile ? (
            <Box
              className="flex items-center gap-1 rounded-full px-1.5 py-1"
              sx={{ backgroundColor: 'rgba(57, 60, 73, 0.72)', backdropFilter: 'blur(12px)' }}
            >
              <Button
                onClick={toggleLang}
                startIcon={<LanguageIcon />}
                sx={{
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.5)',
                  borderRadius: '999px',
                  px: 1.75,
                  py: 0.75,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#08b4ce',
                    color: '#08b4ce',
                    backgroundColor: 'rgba(8,180,206,0.1)',
                  },
                }}
              >
                {i18n.language === 'zh' ? 'EN' : '中文'}
              </Button>
              <IconButton sx={{ color: 'white' }} onClick={() => setDrawerOpen(true)} edge="end" size="large">
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box className="flex items-center gap-2">
              <Box
                component="nav"
                className="flex items-center px-2 py-2"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative whitespace-nowrap px-4 py-2.5 text-[15px] font-semibold transition-colors after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:origin-left after:bg-[#08b4ce] after:transition-transform after:duration-300 hover:text-[#72e5f3] hover:after:scale-x-100 ${
                      isActive(item.path)
                        ? 'text-[#72e5f3] after:scale-x-100'
                        : 'text-[#e5f5f7] after:scale-x-0'
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ))}
              </Box>
              <Button
                onClick={toggleLang}
                startIcon={<LanguageIcon />}
                sx={{
                  color: 'white',
                  backgroundColor: '#08b4ce',
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: '999px',
                  minHeight: 52,
                  px: 2.5,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#069ab0',
                  },
                }}
              >
                {i18n.language === 'zh' ? 'EN' : '中文'}
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box className="w-[250px] bg-[#08b4ce] h-full text-white">
          <Box className="flex justify-end p-4">
            <IconButton color="inherit" onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <Link to={item.path} onClick={() => setDrawerOpen(false)} className="w-full">
                  <ListItemText
                    primary={t(`nav.${item.key}`)}
                    className="px-6 py-2 text-white hover:bg-white/10"
                  />
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
