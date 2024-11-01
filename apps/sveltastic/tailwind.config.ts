import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

import { TwFontSize, TwScreenConfig } from "./src/tw/const";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["dark"],
  prefix: "zd-",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      AveriaSansLibre: ["AveriaSansLibre", ...fontFamily.sans],
    },
    fontSize: TwFontSize,
    colors: {
      border: "hsl(var(--border) / <alpha-value>)",
      input: "hsl(var(--input) / <alpha-value>)",
      ring: "hsl(var(--ring) / <alpha-value>)",
      background: {
        DEFAULT: "hsl(var(--background) / <alpha-value>)",
        600: "hsl(var(--background-600) / <alpha-value>)",
      },
      foreground: {
        DEFAULT: "hsl(var(--foreground) / <alpha-value>)",
        150: "hsl(var(--foreground-150) / <alpha-value>)",
      },
      primary: {
        DEFAULT: "hsl(var(--primary) / <alpha-value>)",
        foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        300: "hsl(var(--primary-300) / <alpha-value>)",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
        foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
        foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
      },
      muted: {
        DEFAULT: "hsl(var(--muted) / <alpha-value>)",
        foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
      },
      accent: {
        DEFAULT: "hsl(var(--accent) / <alpha-value>)",
        foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        300: "hsl(var(--accent-300) / <alpha-value>)",
      },
      popover: {
        DEFAULT: "hsl(var(--popover) / <alpha-value>)",
        foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
      },
      card: {
        DEFAULT: "hsl(var(--card) / <alpha-value>)",
        foreground: "hsl(var(--card-foreground) / <alpha-value>)",
      },
    },
    boxShadow: {
      card: "2px 2px 4px",
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      padding: {
        "nav-bar": "var(--nav-bar-offset)",
      },
      height: {
        "nav-bar": "var(--nav-bar-height)",
        "screen-w-nav-bar":
          "calc(100vh - var(--nav-bar-height) - var(--nav-bar-offset))",
      },
      keyframes: {
        loader: {
          "0%": {
            transform: "scale(0)",
          },
          "50%": {
            opacity: "0.7",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "0",
          },
        },
      },
      animation: {
        loader: "loader 1.3s infinite",
      },
    },
    screens: TwScreenConfig,
  },
};

export default config;
