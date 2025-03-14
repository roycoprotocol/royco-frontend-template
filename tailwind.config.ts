import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
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
      backgroundImage: {
        fungard:
          "linear-gradient(180deg, #FFF8F3 3%, #E5F0FF 73.03%, #E5F7FF 98%)",
        fungardHorizontal:
          "linear-gradient(100deg, #FFF8F3 2.93%, #E5F0FF 72.7%, #E5F7FF 97.58%)",
      },
      screens: {
        "3xl": "1600px",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        gt: ["var(--font-gt)"],
        morion: ["var(--font-morion)"],
        ortica: ["var(--font-ortica)"],
      },

      fontWeight: {
        100: "100",
        200: "200",
        300: "300",
        400: "400",
        500: "500",
        600: "600",
        700: "700",
        800: "800",
        900: "900",
      },
      colors: {
        peach: "#FFF8F3",
        solitude: "#E5F0FF",
        lily: "#E5F7FF",
        dodger_blue: "#007AFF",

        mint: "#4A8160",

        focus: "#EFEFF0",
        primary: "#2A2A27",
        secondary: "#737373",
        tertiary: "#A6A69A",
        z0: "#FFFFFF",
        z2: "#F7F7F6",
        divider: "#E5E5E1",
        separator: "#E5E5E1",
        spring_wood: "#F1F3E7",
        trout: "#525766",
        success: "#3CC27A",
        warning: "#EC8814",
        error: "#EB3C27",
        placeholder: "rgba(96, 96, 85, 0.5)",

        background: "#fbfbf8",

        _primary: "#011A16",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        blink: "blink 1s step-end infinite ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
