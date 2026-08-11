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
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '@/ThemeModeProvider';
import { siteSections } from '@/siteSections';

const navOrder = [
  'product',
  'application',
  'solution',
  'downloads',
  'about',
  'contact',
] as const;

const navItems = navOrder.map((key) => {
  const section = siteSections.find((item) => item.key === key);
  if (!section) throw new Error(`Missing site section for ${key}`);
  return section;
});

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { mode, toggleMode } = useThemeMode();
  const nextModeLabel =
    mode === 'dark'
      ? t('common.switch_to_light_mode')
      : t('common.switch_to_dark_mode');
  const isActive = (path: string) =>
    location.pathname === path ||
    (path === '/product' && location.pathname === '/teleop');

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          backgroundColor:
            mode === 'dark'
              ? 'rgba(5, 6, 8, 0.82)'
              : 'rgba(255, 255, 255, 0.86)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid',
          borderColor:
            mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(16,25,28,0.1)',
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
          <Link to="/" state={{ scrollToSection: true }}>
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
              sx={{
                backgroundColor:
                  mode === 'dark'
                    ? 'rgba(57, 60, 73, 0.72)'
                    : 'rgba(233, 240, 242, 0.9)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <IconButton
                aria-label={nextModeLabel}
                title={nextModeLabel}
                onClick={toggleMode}
                sx={{ color: 'var(--theme-ink)' }}
              >
                {mode === 'dark' ? (
                  <LightModeOutlinedIcon />
                ) : (
                  <DarkModeOutlinedIcon />
                )}
              </IconButton>
              <Button
                onClick={toggleLang}
                startIcon={<LanguageIcon />}
                sx={{
                  color: 'var(--theme-ink)',
                  fontSize: 14,
                  fontWeight: 600,
                  border: '1px solid var(--theme-line)',
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
              <IconButton
                aria-label="Open navigation"
                sx={{ color: 'var(--theme-ink)' }}
                onClick={() => setDrawerOpen(true)}
                edge="end"
                size="large"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box className="flex items-center gap-2">
              <Box component="nav" className="flex items-center px-2 py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    state={{ scrollToSection: true }}
                    className={`relative whitespace-nowrap px-4 py-2.5 text-[15px] font-semibold transition-colors after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:origin-left after:bg-[#08b4ce] after:transition-transform after:duration-300 hover:text-[#08b4ce] hover:after:scale-x-100 ${
                      isActive(item.path)
                        ? 'text-[#08b4ce] after:scale-x-100'
                        : 'text-ink after:scale-x-0'
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ))}
              </Box>
              <IconButton
                aria-label={nextModeLabel}
                title={nextModeLabel}
                onClick={toggleMode}
                sx={{
                  color: 'var(--theme-ink)',
                  border: '1px solid var(--theme-line)',
                  width: 52,
                  height: 52,
                  transition:
                    'color 300ms cubic-bezier(0.16,1,0.3,1), border-color 300ms cubic-bezier(0.16,1,0.3,1), transform 180ms ease',
                  '&:hover': {
                    color: '#08b4ce',
                    borderColor: '#08b4ce',
                  },
                  '&:active': { transform: 'scale(0.96)' },
                }}
              >
                {mode === 'dark' ? (
                  <LightModeOutlinedIcon />
                ) : (
                  <DarkModeOutlinedIcon />
                )}
              </IconButton>
              <Button
                onClick={toggleLang}
                startIcon={<LanguageIcon />}
                sx={{
                  color: '#071013',
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

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box className="h-full w-[280px] bg-panel text-ink">
          <Box className="flex justify-end p-4">
            <IconButton color="inherit" onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <Link
                  to={item.path}
                  state={{ scrollToSection: true }}
                  onClick={() => setDrawerOpen(false)}
                  className="w-full"
                >
                  <ListItemText
                    primary={t(`nav.${item.key}`)}
                    className="px-6 py-2 text-ink hover:bg-section"
                  />
                </Link>
              </ListItem>
            ))}
          </List>
          <Box className="mx-6 mt-5 flex items-center gap-3 border-t border-line pt-5">
            <IconButton
              aria-label={nextModeLabel}
              title={nextModeLabel}
              onClick={toggleMode}
              sx={{
                color: 'var(--theme-ink)',
                border: '1px solid var(--theme-line)',
              }}
            >
              {mode === 'dark' ? (
                <LightModeOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
              )}
            </IconButton>
            <Box component="span" className="text-sm font-semibold">
              {mode === 'dark' ? t('common.light_mode') : t('common.dark_mode')}
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
