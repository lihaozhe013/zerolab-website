import { useState, useEffect } from 'react';
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

const primaryNavItems = navItems.filter((item) => item.key !== 'contact');

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  };

  return (
    <>
      <AppBar position="fixed" sx={{ top: 0, background: 'transparent', boxShadow: 'none' }}>
        <Toolbar
          className="justify-between"
          sx={{
            px: { xs: 2.5, md: 4 },
            minHeight: { xs: 76, md: scrolled ? 88 : 108 },
            transition: 'min-height 800ms cubic-bezier(0.22, 1, 0.36, 1)',
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
              sx={{ backgroundColor: 'rgba(9, 19, 21, 0.72)', backdropFilter: 'blur(12px)' }}
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
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)} edge="end" size="large">
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box className="flex items-center gap-2">
              <Box
                component="nav"
                className="flex items-center rounded-full p-2"
                sx={{
                  backgroundColor: 'transparent',
                }}
              >
                <Box
                  className="flex overflow-hidden"
                  sx={{
                    maxWidth: scrolled ? 0 : 480,
                    opacity: scrolled ? 0 : 1,
                    transition: 'max-width 1050ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms ease',
                    pointerEvents: scrolled ? 'none' : 'auto',
                  }}
                >
                  {primaryNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors hover:text-[#08b4ce] ${
                        location.pathname === item.path
                          ? 'bg-[#0d5666] text-[#72e5f3]'
                          : 'text-[#e5f5f7]'
                      }`}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  ))}
                </Box>
                <Link
                  to="/contact"
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[15px] font-bold transition-colors ${
                    location.pathname === '/contact'
                      ? 'bg-[#069ab0] text-white'
                      : 'bg-[#08b4ce] text-white hover:bg-[#069ab0]'
                  }`}
                >
                  {t('nav.contact')}
                </Link>
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
