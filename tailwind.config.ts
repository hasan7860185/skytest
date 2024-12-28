import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#191970", // Updated to midnight blue
          foreground: "#ffffff",
          light: "#1A1F3C",
          dark: "#050A1C",
        },
        secondary: {
          DEFAULT: "#403E43",
          foreground: "#ffffff",
          light: "#8A898C",
          dark: "#221F26",
        },
        mauve: {
          DEFAULT: "#1A1F2C",
        },
        background: {
          DEFAULT: "#F6F6F7",
          dark: "#191970", // Updated to match primary
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(102.3deg, rgba(25,25,112,1) 5.9%, rgba(26,31,60,1) 64%, rgba(64,62,67,1) 89%)',
        'gradient-secondary': 'linear-gradient(90deg, rgba(26,31,60,1) 0%, rgba(25,25,112,1) 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;