import { createContext, useState, useMemo, useEffect } from "react";
import { createTheme } from "@mui/material/styles";

// 🎨 Color design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#0d001cff",
          500: "#120126ff", // Back Side Color
          600: "#0d001cff",
          700: "#0d001cff",
          800: "#0d001cff",
          900: "#0d001cff",
        },
        greenAccent: {
          100: "#fff9e0",
          200: "#fff0b3",
          300: "#ffe680",
          400: "#ffbf00ff",
          500: "#ffc21aff",
          600: "#cca415",
          700: "#997510",
          800: "#664c0a",
          900: "#332605",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#1721e9ff",
          600: "#535ac8",
          700: "#1721e9ff",
          800: "#2a2d64",
          900: "#151632",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#110263ff",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0",
          500: "#e3e4e6ff",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#053fffff",
          500: "#f0ac1bff",
          600: "#0516ffff",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c3c6fd",
          900: "#e1e2fe",
        },
      }),
});

// ⚙️ MUI Theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            primary: { main: colors.primary[500] },
            secondary: { main: colors.greenAccent[500] },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: { default: colors.primary[500] },
          }
        : {
            primary: { main: colors.primary[100] },
            secondary: { main: colors.greenAccent[500] },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: { default: "#fcfcfcff" },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: { fontFamily: "Source Sans Pro, sans-serif", fontSize: 40 },
      h2: { fontFamily: "Source Sans Pro, sans-serif", fontSize: 32 },
      h3: { fontFamily: "Source Sans Pro, sans-serif", fontSize: 24 },
      h4: { fontFamily: "Source Sans Pro, sans-serif", fontSize: 20 },
      h5: { fontFamily: "Source Sans Pro, sans-serif", fontSize: 16 },
      h6: { fontFamily: "Source Sans Pro, sans-serif", fontSize: 14 },
    },
  };
};

// 🌓 Context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

// 🧠 Custom hook with localStorage persistence
export const useMode = () => {
  const storedMode = localStorage.getItem("themeMode") || "dark";
  const [mode, setMode] = useState(storedMode);

  useEffect(() => {
    document.body.setAttribute("data-theme", mode);
    localStorage.setItem("themeMode", mode);

    // Smooth transition effect for whole page
    document.body.style.transition = "background-color 0.5s ease, color 0.5s ease";
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
