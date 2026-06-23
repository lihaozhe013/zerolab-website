import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#08b4ce",
      contrastText: "#fff",
    },
    background: {
      default: "#ffffff",
    },
    text: {
      primary: "#222222",
      secondary: "#777777",
    },
  },
  typography: {
    fontFamily: '"Inter", "Noto Sans SC", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 800,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none" as const,
          borderRadius: 0,
        },
      },
    },
  },
});

export default theme;
