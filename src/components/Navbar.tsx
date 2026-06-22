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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const navItems = [
  { label: "关于", path: "/about" },
  { label: "产品", path: "/product" },
  { label: "方案", path: "/project" },
  { label: "应用", path: "/application" },
  { label: "联系", path: "/contact" },
];

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const isHome = location.pathname === "/";
  const AppBarStyle = isHome || transparent
    ? { background: "transparent", boxShadow: "none" }
    : { background: "rgba(4,9,30,0.7)", boxShadow: "none" };

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
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              edge="end"
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box component="nav" className="flex gap-1">
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
                  {item.label}
                </Link>
              ))}
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
                    primary={item.label}
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
