import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";

const navItems = [
  { key: "about", path: "/about" },
  { key: "product", path: "/product" },
  { key: "solution", path: "/solution" },
  { key: "application", path: "/application" },
  { key: "contact", path: "/contact" },
];

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const isHome = location.pathname === "/";
  const AppBarStyle = isHome || transparent
    ? { background: "transparent", boxShadow: "none" }
    : { background: "rgba(4,9,30,0.7)", boxShadow: "none" };

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh");
  };

  return (
    <>
      <AppBar position={isHome ? "absolute" : "relative"} sx={AppBarStyle}>
        <Toolbar className="justify-between px-[6%]">
          <Link to="/">
            <Box
              component="img"
              src="/images/LOGO1.png"
              alt="ZeroLab Logo"
              sx={{ height: 40 }}
            />
          </Link>

          {isMobile ? (
            <Box className="flex items-center gap-2">
              <Button
                onClick={toggleLang}
                startIcon={<LanguageIcon />}
                sx={{
                  color: "white",
                  ml: 2,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.5)",
                  borderRadius: "20px",
                  px: 2,
                  py: 0.5,
                  textTransform: "none",
                  "&:hover": { borderColor: "#08b4ce", color: "#08b4ce", backgroundColor: "rgba(8,180,206,0.1)" },
                }}
              >
                {i18n.language === "zh" ? "EN" : "中文"}
              </Button>
              <IconButton
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                edge="end"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box component="nav" className="flex gap-1 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 text-white text-sm transition-colors hover:text-[#08b4ce] after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-[#08b4ce] after:transition-all after:duration-300 hover:after:w-full ${
                    location.pathname === item.path
                      ? "text-[#08b4ce] after:w-full"
                      : "after:w-0"
                  }`}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
              <Button
                onClick={toggleLang}
                startIcon={<LanguageIcon />}
                sx={{
                  color: "white",
                  ml: 2,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.5)",
                  borderRadius: "20px",
                  px: 2,
                  py: 0.5,
                  textTransform: "none",
                  "&:hover": { borderColor: "#08b4ce", color: "#08b4ce", backgroundColor: "rgba(8,180,206,0.1)" },
                }}
              >
                {i18n.language === "zh" ? "EN" : "中文"}
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
        <Box className="w-[250px] bg-[#08b4ce] h-full text-white">
          <Box className="flex justify-end p-4">
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <Link
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  className="w-full"
                >
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